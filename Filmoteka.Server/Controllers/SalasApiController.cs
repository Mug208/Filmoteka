using Filmoteka.Server.DTOs;
using Filmoteka.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace Filmoteka.Server.Controllers
{
    [ApiController]
    [Route("api/sales")]
    public class SalasApiController : ControllerBase
    {
        private readonly ISalaService _salaService;

        public SalasApiController(ISalaService salaService)
        {
            _salaService = salaService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SalaDto>>> GetAll()
        {
            var result = await _salaService.DobiSveAsync();
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<SalaDto>> Get(Guid id)
        {
            var sala = await _salaService.DobiOdIdAsync(id);
            if (sala == null) return NotFound();
            return Ok(sala);
        }

        [HttpPost]
        public async Task<ActionResult<SalaDto>> Create([FromBody] NapraviSalaDto dto)
        {
            var created = await _salaService.DodajAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<SalaDto>> Update(Guid id, [FromBody] NapraviSalaDto dto)
        {
            var updated = await _salaService.AzurirajAsync(id, dto);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var (success, error) = await _salaService.ObrisiAsync(id);
            if (!success)
            {
                if (error != null) return BadRequest(new { error });
                return NotFound();
            }
            return NoContent();
        }
    }
}
