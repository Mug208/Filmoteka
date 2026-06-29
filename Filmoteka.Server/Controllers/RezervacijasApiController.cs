using Filmoteka.Server.DTOs;
using Filmoteka.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace Filmoteka.Server.Controllers
{
    [ApiController]
    [Route("api/rezervacijas")]
    public class RezervacijasApiController : ControllerBase
    {
        private readonly IRezervacijaService _rezervacijaService;

        public RezervacijasApiController(IRezervacijaService rezervacijaService)
        {
            _rezervacijaService = rezervacijaService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RezervacijaDto>>> GetAll([FromQuery] Guid? projekcijaId = null)
        {
            var result = projekcijaId.HasValue
                ? await _rezervacijaService.DobiOdProjekcijaAsync(projekcijaId.Value)
                : await _rezervacijaService.DobiSveAsync();

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<RezervacijaDto>> Create([FromBody] NapraviRezervacijaDto dto)
        {
            var created = await _rezervacijaService.DodajAsync(dto);
            return Created(string.Empty, created);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _rezervacijaService.ObrisiAsync(id);
            if (!deleted) return NotFound();
            return NoContent();
        }
    }
}
