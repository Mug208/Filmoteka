using Filmoteka.Server.DTOs;
using Filmoteka.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace Filmoteka.Server.Controllers
{
    [ApiController]
    [Route("api/projekcijas")]
    public class ProjekcijasApiController : ControllerBase
    {
        private readonly IProjekcijaService _projekcijaService;

        public ProjekcijasApiController(IProjekcijaService projekcijaService)
        {
            _projekcijaService = projekcijaService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProjekcijaDto>>> GetAll([FromQuery] bool dostupne = false)
        {
            var result = dostupne
                ? await _projekcijaService.DobiDostupneAsync()
                : await _projekcijaService.DobiSveAsync();

            return Ok(result);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<ProjekcijaDto>> Get(Guid id)
        {
            var projekcija = await _projekcijaService.DobiOdIdAsync(id);
            if (projekcija == null)
            {
                return NotFound();
            }

            return Ok(projekcija);
        }

        [HttpPost]
        public async Task<ActionResult<ProjekcijaDto>> Create([FromBody] NapraviProjekcijaDto dto)
        {
            var created = await _projekcijaService.DodajAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var (success, error) = await _projekcijaService.ObrisiAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

        [HttpPost("{id:guid}/otkazi")]
        public async Task<IActionResult> Otkazi(Guid id)
        {
            var success = await _projekcijaService.OtkaziAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
