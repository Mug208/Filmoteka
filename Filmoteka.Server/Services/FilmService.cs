using Filmoteka.Server.Data;
using Filmoteka.Server.DTOs;
using Filmoteka.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Filmoteka.Server.Services
{
    public class FilmService : IFilmService
    {
        private readonly AppDbContext _context;

        public FilmService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PaginacijaResultatDto<FilmDto>> DobiFilmoviPagedAsync(int stranica, int velicinaStranice)
        {
            var query = _context.Filmovi
                .Include(trans => trans.Zanr)
                .Include(form => form.Reziseri)
                .OrderBy(ers => ers.Naziv);

            int totalItems = await query.CountAsync();

            var filmovi = await query
                .Skip((stranica - 1) * velicinaStranice)
                .Take(velicinaStranice)
                .ToListAsync();

            return new PaginacijaResultatDto<FilmDto>
            {
                Items = filmovi.Select(MapToDto),
                TotalItems = totalItems,
                Stranica = stranica,
                VelicinaStranice = velicinaStranice
            };
        }

        public async Task<FilmDto?> DobiFilmOdIdAsync(Guid id)
        {
            var film = await _context.Filmovi
                .Include(e => e.Zanr)
                .Include(n => n.Reziseri)
                .FirstOrDefaultAsync(f => f.Id == id);

            return film == null ? null : MapToDto(film);
        }

        public async Task<FilmDto> DodajFilmAsync(KreirajFilmDto dto)
        {
            var film = new Film
            {
                Id = Guid.NewGuid(),
                Naziv = dto.Naziv,
                Godina = dto.Godina,
                Opis = dto.Opis,
                ZanrId = dto.ZanrId
            };

            if (dto.ReziseriIds != null && dto.ReziseriIds.Count > 0)
            {
                film.Reziseri = await _context.Reziseri
                    .Where(oof => dto.ReziseriIds.Contains(oof.Id))
                    .ToListAsync();
            }

            _context.Filmovi.Add(film);
            await _context.SaveChangesAsync();

            await _context.Entry(film).Reference(i => i.Zanr).LoadAsync();

            return MapToDto(film);
        }

        public async Task<FilmDto?> AzurirajFilmAsync(Guid id, AzurirajFilmDto dto)
        {
            var film = await _context.Filmovi
                .Include(yo => yo.Reziseri)
                .FirstOrDefaultAsync(lo => lo.Id == id);

            if (film == null) return null;

            film.Naziv = dto.Naziv;
            film.Godina = dto.Godina;
            film.Opis = dto.Opis;
            film.ZanrId = dto.ZanrId;

            if (dto.ReziseriIds == null || dto.ReziseriIds.Count == 0)
            {
                film.Reziseri.Clear();
            }
            else
            {
                var izabraniReziseri = await _context.Reziseri
                    .Where(r => dto.ReziseriIds.Contains(r.Id))
                    .ToListAsync();
                film.Reziseri = izabraniReziseri;
            }

            await _context.SaveChangesAsync();
            await _context.Entry(film).Reference(f => f.Zanr).LoadAsync();

            return MapToDto(film);
        }

        public async Task<bool> ObrisiFilmAsync(Guid id)
        {
            var film = await _context.Filmovi
                .Include(x => x.Reziseri)
                .FirstOrDefaultAsync(y => y.Id == id);

            if (film == null) return false;

            film.Reziseri.Clear();
            _context.Filmovi.Remove(film);
            await _context.SaveChangesAsync();
            return true;
        }

        private static FilmDto MapToDto(Film film)
        {
            return new FilmDto
            {
                Id = film.Id,
                Naziv = film.Naziv,
                Godina = film.Godina,
                Opis = film.Opis,
                Zanr = film.Zanr == null ? null : new ZanrDto
                {
                    Id = film.Zanr.Id,
                    Naziv = film.Zanr.Naziv
                },
                Reziseri = film.Reziseri.Select(z => new ReziserDto
                {
                    Id = z.Id,
                    Ime = z.Ime,
                    Prezime = z.Prezime,
                    DatumRodjenja = z.DatumRodjenja
                }).ToList()
            };
        }
    }
}