using Filmoteka.Server.DTOs;
using Filmoteka.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace Filmoteka.Server.Controllers
{
    [ApiController]
    [Route("api/films")]
    public class FilmsApiController : ControllerBase
    {
        private readonly IFilmService _filmService;

        public FilmsApiController(IFilmService filmService)
        {
            _filmService = filmService;
        }

        [HttpGet]
        public async Task<ActionResult<PaginacijaResultatDto<FilmDto>>> GetPaged(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 5,
            [FromQuery] string? query = null,
            [FromQuery] Guid? zanrId = null,
            [FromQuery] int? godina = null,
            [FromQuery] bool? dostupnoUBioskopu = null)
        {
            var result = await _filmService.DobiFilmoviPagedAsync(page, pageSize, query, zanrId, godina, dostupnoUBioskopu);
            return Ok(new
            {
                items = result.Items,
                totalItems = result.TotalItems,
                page = result.Stranica,
                pageSize = result.VelicinaStranice,
                totalPages = result.UkupnoStranica
            });
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<FilmDto>> Get(Guid id)
        {
            var film = await _filmService.DobiFilmOdIdAsync(id);
            if (film == null)
            {
                return NotFound();
            }

            return Ok(film);
        }

        [HttpPost]
        public async Task<ActionResult<FilmDto>> Create([FromBody] KreirajFilmDto dto)
        {
            var created = await _filmService.DodajFilmAsync(dto);
            return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<FilmDto>> Update(Guid id, [FromBody] AzurirajFilmDto dto)
        {
            var updated = await _filmService.AzurirajFilmAsync(id, dto);
            if (updated == null)
            {
                return NotFound();
            }

            return Ok(updated);
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var deleted = await _filmService.ObrisiFilmAsync(id);
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
