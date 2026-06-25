using Filmoteka.Server.Data;
using Filmoteka.Server.DTOs;
using Filmoteka.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Filmoteka.Server.Services
{
    public class ZanrService : IZanrService
    {
        private readonly AppDbContext _context;

        public ZanrService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ZanrDto>> DobiSveAsync()
        {
            return await _context.Zanrovi
                .Select(zanr => new ZanrDto
                {
                    Id = zanr.Id,
                    Naziv = zanr.Naziv
                })
                .ToListAsync();
        }

        public async Task<ZanrDto?> DobiOdIdAsync(Guid id)
        {
            var zanr = await _context.Zanrovi.FindAsync(id);
            return zanr == null ? null : new ZanrDto
            {
                Id = zanr.Id,
                Naziv = zanr.Naziv
            };
        }

        public async Task<ZanrDto> DodajAsync(KreirajZanrDto dto)
        {
            var zanr = new Zanr
            {
                Id = Guid.NewGuid(),
                Naziv = dto.Naziv
            };
            _context.Zanrovi.Add(zanr);
            await _context.SaveChangesAsync();
            return new ZanrDto
            {
                Id = zanr.Id,
                Naziv = zanr.Naziv
            };
        }

        public async Task<ZanrDto?> AzurirajAsync(Guid id, KreirajZanrDto dto)
        {
            var zanr = await _context.Zanrovi.FindAsync(id);
            if (zanr == null) return null;
            zanr.Naziv = dto.Naziv;
            await _context.SaveChangesAsync();
            return new ZanrDto
            {
                Id = zanr.Id,
                Naziv = zanr.Naziv
            };
        }

        public async Task<bool> ObrisiAsync(Guid id)
        {
            var zanr = await _context.Zanrovi.FindAsync(id);
            if (zanr == null) return false;
            _context.Zanrovi.Remove(zanr);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
