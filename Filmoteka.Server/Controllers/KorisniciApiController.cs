using Filmoteka.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace Filmoteka.Server.Controllers
{
    [ApiController]
    [Route("api/korisnici")]
    public class KorisniciApiController : ControllerBase
    {
        private readonly IKorisnikService _korisnikService;

        public KorisniciApiController(IKorisnikService korisnikService)
        {
            _korisnikService = korisnikService;
        }

        public class PotvrdaDto
        {
            public string Ime { get; set; } = string.Empty;
            public string Email { get; set; } = string.Empty;
            public string Username { get; set; } = string.Empty;
        }

        [HttpPost("posalji-potvrdu")]
        public async Task<IActionResult> PosaljiPotvrdu([FromBody] PotvrdaDto dto)
        {
            try
            {
                await _korisnikService.PosaljiPotvrduAsync(dto.Ime, dto.Email, dto.Username);
                return Ok();
            }
            catch
            {
                return BadRequest("Greška pri slanju emaila.");
            }
        }

        [HttpPost("odobri/{id}")]
        public async Task<IActionResult> OdobriKorisnika(Guid id)
        {
            try
            {
                await _korisnikService.OdobriKorisnikaAsync(id);
                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
            catch
            {
                return BadRequest("Greška pri odobravanju korisnika.");
            }
        }
    }
}