using Filmoteka.Server.DTOs;
using Filmoteka.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace Filmoteka.Server.Controllers
{
    [ApiController]
    [Route("api/rezisers")]
    public class RezisersApiController : ControllerBase
    {
        private readonly IReziserService _reziserService;

        public RezisersApiController(IReziserService reziserService)
        {
            _reziserService = reziserService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReziserDto>>> GetAll()
        {
            var result = await _reziserService.DobiSveAsync();
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ReziserDto>> Get(Guid id)
        {
            var reziser = await _reziserService.DobiOdIdAsync(id);
            if (reziser == null)
            {
                return NotFound();
            }

            return Ok(reziser);
        }

        [HttpPost]
        public async Task<ActionResult<ReziserDto>> Create([FromBody] KreirajReziserDto dto)
        {
            var created = await _reziserService.DodajAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<ReziserDto>> Update(Guid id, [FromBody] KreirajReziserDto dto)
        {
            var updated = await _reziserService.AzurirajAsync(id, dto);
            if (updated == null)
            {
                return NotFound();
            }

            return Ok(updated);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _reziserService.ObrisiAsync(id);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
