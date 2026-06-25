using Filmoteka.Server.DTOs;
using Filmoteka.Server.Models;

namespace Filmoteka.Server.Services
{
    public interface IFilmService
    {
        Task<PaginacijaResultatDto<FilmDto>> DobiFilmoviPagedAsync(int stranica, int velicinaStranice);
        Task<FilmDto?> DobiFilmOdIdAsync(Guid id);
        Task<FilmDto> DodajFilmAsync(KreirajFilmDto dto);
        Task<FilmDto?> AzurirajFilmAsync(Guid id, AzurirajFilmDto dto);
        Task<bool> ObrisiFilmAsync(Guid id);
    }
}
