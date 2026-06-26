using Filmoteka.Server.DTOs;
using Filmoteka.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace Filmoteka.Server.Controllers
{
    [ApiController]
    [Route("api/zanrs")]
    public class ZanrsApiController : ControllerBase
    {
        private readonly IZanrService _zanrService;

        public ZanrsApiController(IZanrService zanrService)
        {
            _zanrService = zanrService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ZanrDto>>> GetAll()
        {
            var result = await _zanrService.DobiSveAsync();
            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ZanrDto>> Get(Guid id)
        {
            var zanr = await _zanrService.DobiOdIdAsync(id);
            if (zanr == null)
            {
                return NotFound();
            }

            return Ok(zanr);
        }

        [HttpPost]
        public async Task<ActionResult<ZanrDto>> Create([FromBody] KreirajZanrDto dto)
        {
            var created = await _zanrService.DodajAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<ZanrDto>> Update(Guid id, [FromBody] KreirajZanrDto dto)
        {
            var updated = await _zanrService.AzurirajAsync(id, dto);
            if (updated == null)
            {
                return NotFound();
            }

            return Ok(updated);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _zanrService.ObrisiAsync(id);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
