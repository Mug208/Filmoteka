using Filmoteka.Server.Data;
using Filmoteka.Server.DTOs;
using Filmoteka.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Filmoteka.Server.Services
{
    public interface ISalaService
    {
        Task<IEnumerable<SalaDto>> DobiSveAsync();
        Task<SalaDto?> DobiOdIdAsync(Guid id);
        Task<SalaDto> DodajAsync(NapraviSalaDto dto);
        Task<SalaDto?> AzurirajAsync(Guid id, NapraviSalaDto dto);
        Task<(bool Success, string? Error)> ObrisiAsync(Guid id);
    }

    public class SalaService : ISalaService
    {
        private readonly AppDbContext _context;

        public SalaService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SalaDto>>DobiSveAsync()
        {
            return await _context.Sale
                .Include(s => s.Projekcije)
                .Select(s => new SalaDto
                {
                    Id = s.Id,
                    Naziv = s.Naziv,
                    Kapacitet = s.Kapacitet,
                    Tip = s.Tip.ToString(),
                    ImaProjekcije = s.Projekcije.Any()
                })
                .ToListAsync();
        }

        public async Task<SalaDto?> DobiOdIdAsync(Guid id)
        {
            var s = await _context.Sale.Include(s => s.Projekcije).FirstOrDefaultAsync(s => s.Id == id);
            if (s == null) return null;
            return new SalaDto
            {
                Id = s.Id,
                Naziv = s.Naziv,
                Kapacitet = s.Kapacitet,
                Tip = s.Tip.ToString(),
                ImaProjekcije = s.Projekcije.Any()
            };
        }

        public async Task<SalaDto> DodajAsync(NapraviSalaDto dto)
        {
            bool postoji = await _context.Sale.AnyAsync(s => s.Naziv.ToLower() == dto.Naziv.ToLower());
            if (postoji)
                throw new InvalidOperationException("Sala sa ovim nazivom vec postoji.");

            if (!Enum.TryParse<TipSale>(dto.Tip, ignoreCase: true, out var tip))
                throw new InvalidOperationException("Tip sale nije validan. Dozvoljeno: Standard, ThreeD, IMAX.");

            var sala = new Sala
            {
                Id = Guid.NewGuid(),
                Naziv = dto.Naziv,
                Kapacitet = dto.Kapacitet,
                Tip = tip
            };
            _context.Sale.Add(sala);
            await _context.SaveChangesAsync();

            return new SalaDto { Id = sala.Id, Naziv = sala.Naziv, Kapacitet = sala.Kapacitet, Tip = sala.Tip.ToString(), ImaProjekcije = false };
        }

        public async Task<SalaDto?> AzurirajAsync(Guid id, NapraviSalaDto dto)
        {
            var sala = await _context.Sale.FindAsync(id);
            if (sala == null) return null;

            bool postoji = await _context.Sale.AnyAsync(s => s.Id != id && s.Naziv.ToLower() == dto.Naziv.ToLower());
            if (postoji)
                throw new InvalidOperationException("Sala sa ovim nazivom vec postoji.");

            if (!Enum.TryParse<TipSale>(dto.Tip, ignoreCase: true, out var tip))
                throw new InvalidOperationException("Tip sale nije validan.");

            sala.Naziv = dto.Naziv;
            sala.Kapacitet = dto.Kapacitet;
            sala.Tip = tip;
            await _context.SaveChangesAsync();

            return new SalaDto { Id = sala.Id, Naziv = sala.Naziv, Kapacitet = sala.Kapacitet, Tip = sala.Tip.ToString(), ImaProjekcije = false };
        }

        public async Task<(bool Success, string? Error)> ObrisiAsync(Guid id)
        {
            var sala = await _context.Sale.Include(s => s.Projekcije).FirstOrDefaultAsync(s => s.Id == id);
            if (sala == null) return (false, null);

            if (sala.Projekcije.Any())
                return (false, "Sala ne moze biti obrisana jer ima zakazane projekcije.");

            _context.Sale.Remove(sala);
            await _context.SaveChangesAsync();
            return (true, null);
        }
    }
}
