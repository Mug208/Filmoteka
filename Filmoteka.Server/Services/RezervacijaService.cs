using Filmoteka.Server.Data;
using Filmoteka.Server.DTOs;
using Filmoteka.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Filmoteka.Server.Services
{
    public interface IRezervacijaService
    {
        Task<IEnumerable<RezervacijaDto>> DobiSveAsync();
        Task<IEnumerable<RezervacijaDto>> DobiOdProjekcijaAsync(Guid projekcijaId);
        Task<RezervacijaDto> DodajAsync(NapraviRezervacijaDto dto);  
        Task<bool> ObrisiAsync(Guid id);
    }

    public class RezervacijaService : IRezervacijaService
    {
        private readonly AppDbContext _context;

        public RezervacijaService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<RezervacijaDto>> DobiSveAsync()
        {
            var list = await _context.Rezervacije
                .Include(r => r.Projekcija).ThenInclude(p => p!.Film)
                .Include(r => r.Projekcija).ThenInclude(p => p!.Sala)
                .OrderByDescending(r => r.DatumRezervacije)
                .ToListAsync();

            return list.Select(r => MapToDto(r));
        }

        public async Task<IEnumerable<RezervacijaDto>> DobiOdProjekcijaAsync(Guid projekcijaId)
        {
            var list = await _context.Rezervacije
                .Where(r => r.ProjekcijaId == projekcijaId)
                .Include(r => r.Projekcija).ThenInclude(p => p!.Film)
                .Include(r => r.Projekcija).ThenInclude(p => p!.Sala)
                .OrderByDescending(r => r.DatumRezervacije)
                .ToListAsync();

            return list.Select(r => MapToDto(r));
        }

        public async Task<RezervacijaDto> DodajAsync(NapraviRezervacijaDto dto)
        {
            var projekcija = await _context.Projekcije
                .Include(p => p.Film)
                .Include(p => p.Sala)
                .FirstOrDefaultAsync(p => p.Id == dto.ProjekcijaId);

            if (projekcija == null)
                throw new InvalidOperationException("Projekcija ne postoji.");

            if (projekcija.DostupnaMesta <= 0)
                throw new InvalidOperationException("Nema vise slobodnih mesta za ovu projekciju.");

            bool vecRezervisao = await _context.Rezervacije
                .AnyAsync(r => r.ProjekcijaId == dto.ProjekcijaId
                            && r.KorisnikEmail.ToLower() == dto.KorisnikEmail.ToLower());
            if (vecRezervisao)
                throw new InvalidOperationException("Vec ste rezervisali mesto za ovu projekciju.");

            var rezervacija = new Rezervacija
            {
                Id = Guid.NewGuid(),
                ProjekcijaId = dto.ProjekcijaId,
                KorisnikIme = dto.KorisnikIme,
                KorisnikEmail = dto.KorisnikEmail,
                DatumRezervacije = DateTime.UtcNow
            };

            _context.Rezervacije.Add(rezervacija);

            projekcija.DostupnaMesta -= 1;
            _context.Projekcije.Update(projekcija);

            await _context.SaveChangesAsync();

            return MapToDto(rezervacija, projekcija);
        }

        public async Task<bool> ObrisiAsync(Guid id)
        {
            var r = await _context.Rezervacije
                .Include(r => r.Projekcija)
                .FirstOrDefaultAsync(r => r.Id == id);
            if (r == null) return false;

            if (r.Projekcija != null)
            {
                r.Projekcija.DostupnaMesta += 1;
                _context.Projekcije.Update(r.Projekcija);
            }

            _context.Rezervacije.Remove(r);
            await _context.SaveChangesAsync();
            return true;
        }

        private static RezervacijaDto MapToDto(Rezervacija r, Projekcija? projekcija = null)
        {
            var p = projekcija ?? r.Projekcija;
            return new RezervacijaDto
            {
                Id = r.Id,
                ProjekcijaId = r.ProjekcijaId,
                KorisnikIme = r.KorisnikIme,
                KorisnikEmail = r.KorisnikEmail,
                DatumRezervacije = r.DatumRezervacije,
                Projekcija = p == null ? null : new ProjekcijaDto
                {
                    Id = p.Id,
                    VremePocetka = p.VremePocetka,
                    VremeZavrsetka = p.VremeZavrsetka,
                    DostupnaMesta = p.DostupnaMesta,
                    UkupnoMesta = p.Sala?.Kapacitet ?? 0,
                    Film = p.Film == null ? null : new FilmDto { Id = p.Film.Id, Naziv = p.Film.Naziv, Godina = p.Film.Godina, Opis = p.Film.Opis },
                    Sala = p.Sala == null ? null : new SalaDto { Id = p.Sala.Id, Naziv = p.Sala.Naziv, Kapacitet = p.Sala.Kapacitet, Tip = p.Sala.Tip.ToString() }
                }
            };
        }
    }
}
