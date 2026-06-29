using Filmoteka.Server.Data;
using Filmoteka.Server.DTOs;
using Filmoteka.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Filmoteka.Server.Services
{
    public interface IProjekcijaService
    {
        Task<IEnumerable<ProjekcijaDto>> DobiSveAsync();
        Task<IEnumerable<ProjekcijaDto>> DobiDostupneAsync();
        Task<ProjekcijaDto?> DobiOdIdAsync(Guid id);
        Task<ProjekcijaDto> DodajAsync(NapraviProjekcijaDto dto);
        Task<(bool Success, string? Error)> ObrisiAsync(Guid id);
    }

    public class ProjekcijaService : IProjekcijaService
    {
        private readonly AppDbContext _context;

        public ProjekcijaService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ProjekcijaDto>> DobiSveAsync()
        {
            var list = await _context.Projekcije
                .Include(p => p.Film)
                .Include(p => p.Sala)
                .OrderByDescending(p => p.VremePocetka)
                .ToListAsync();

            return list.Select(p => MapToDto(p));
        }

        public async Task<IEnumerable<ProjekcijaDto>> DobiDostupneAsync()
        {
            return await _context.ProekcijeSafeAsync();
        }

        public async Task<ProjekcijaDto?> DobiOdIdAsync(Guid id)
        {
            var p = await _context.Projekcije
                .Include(p => p.Film)
                .Include(p => p.Sala)
                .FirstOrDefaultAsync(p => p.Id == id);
            return p == null ? null : MapToDto(p);
        }

        public async Task<ProjekcijaDto> DodajAsync(NapraviProjekcijaDto dto)
        {
            if (dto.VremeZavrsetka <= dto.VremePocetka)
                throw new InvalidOperationException("Vreme zavrsetka mora biti nakon vremena pocetka.");

            var sala = await _context.Sale.FindAsync(dto.SalaId);
            if (sala == null)
                throw new InvalidOperationException("Sala ne postoji.");

            var film = await _context.Filmovi.FindAsync(dto.FilmId);
            if (film == null)
                throw new InvalidOperationException("Film ne postoji.");

            var postojece = await _context.Projekcije
                .Where(p => p.SalaId == dto.SalaId)
                .ToListAsync();

            foreach (var p in postojece)
            {
                bool preklapaSe = dto.VremePocetka < p.VremeZavrsetka.AddMinutes(15)
                               && dto.VremeZavrsetka > p.VremePocetka.AddMinutes(-15);
                if (preklapaSe)
                {
                    throw new InvalidOperationException(
                        $"Projekcija se preklapa sa postojecom projekcijom ({p.VremePocetka:dd.MM.yyyy HH:mm} - {p.VremeZavrsetka:HH:mm}). " +
                        "Termini moraju imati bar 15 minuta razmaka");
                }
            }

            var projekcija = new Projekcija
            {
                Id = Guid.NewGuid(),
                FilmId = dto.FilmId,
                SalaId = dto.SalaId,
                VremePocetka = dto.VremePocetka,
                VremeZavrsetka = dto.VremeZavrsetka,
                DostupnaMesta = sala.Kapacitet
            };

            _context.Projekcije.Add(projekcija);
            await _context.SaveChangesAsync();

            return MapToDto(projekcija, film, sala);
        }

        public async Task<(bool Success, string? Error)> ObrisiAsync(Guid id)
        {
            var p = await _context.Projekcije.FindAsync(id);
            if (p == null) return (false, null);

            _context.Projekcije.Remove(p);
            await _context.SaveChangesAsync();
            return (true, null);
        }

        private static ProjekcijaDto MapToDto(Projekcija p, Film? film = null, Sala? sala = null)
        {
            var f = film ?? p.Film;
            var s = sala ?? p.Sala;
            return new ProjekcijaDto
            {
                Id = p.Id,
                Film = f == null ? null : new FilmDto
                {
                    Id = f.Id,
                    Naziv = f.Naziv,
                    Godina = f.Godina,
                    Opis = f.Opis
                },
                Sala = s == null ? null : new SalaDto
                {
                    Id = s.Id,
                    Naziv = s.Naziv,
                    Kapacitet = s.Kapacitet,
                    Tip = s.Tip.ToString()
                },
                VremePocetka = p.VremePocetka,
                VremeZavrsetka = p.VremeZavrsetka,
                DostupnaMesta = p.DostupnaMesta,
                UkupnoMesta = s?.Kapacitet ?? 0
            };
        }
    }

    internal static class ProjekcijaExtensions
    {
        public static async Task<IEnumerable<ProjekcijaDto>> ProekcijeSafeAsync(this AppDbContext context)
        {
            var list = await context.Projekcije
                .Include(p => p.Film)
                .Include(p => p.Sala)
                .Where(p => p.DostupnaMesta > 0)
                .OrderBy(p => p.VremePocetka)
                .ToListAsync();

            return list.Select(p => new ProjekcijaDto
            {
                Id = p.Id,
                Film = p.Film == null ? null : new FilmDto { Id = p.Film.Id, Naziv = p.Film.Naziv, Godina = p.Film.Godina, Opis = p.Film.Opis },
                Sala = p.Sala == null ? null : new SalaDto { Id = p.Sala.Id, Naziv = p.Sala.Naziv, Kapacitet = p.Sala.Kapacitet, Tip = p.Sala.Tip.ToString() },
                VremePocetka = p.VremePocetka,
                VremeZavrsetka = p.VremeZavrsetka,
                DostupnaMesta = p.DostupnaMesta,
                UkupnoMesta = p.Sala?.Kapacitet ?? 0
            });
        }
    }
}
