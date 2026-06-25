using Filmoteka.Server.Data;
using Filmoteka.Server.DTOs;
using Filmoteka.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Filmoteka.Server.Services
{
    public class ReziserService : IReziserService
    {
        private readonly AppDbContext _Context;

        public ReziserService(AppDbContext context)
        {
            _Context = context;
        }

        public async Task<IEnumerable<ReziserDto>> DobiSveAsync()
        {
            return await _Context.Reziseri
                .Select(r => new ReziserDto
                {
                    Id = r.Id,
                    Ime = r.Ime,
                    Prezime = r.Prezime,
                    DatumRodjenja = r.DatumRodjenja
                })
                .ToListAsync();
        }

        public async Task<ReziserDto?> DobiOdIdAsync(Guid id)
        {
            var reziser = await _Context.Reziseri.FindAsync(id);
            if (reziser == null) return null;
            return new ReziserDto
            {
                Id = reziser.Id,
                Ime = reziser.Ime,
                Prezime = reziser.Prezime,
                DatumRodjenja = reziser.DatumRodjenja
            };
        }

        public async Task<ReziserDto> DodajAsync(KreirajReziserDto dto)
        {
            var reziser = new Reziser
            {
                Id = Guid.NewGuid(),
                Ime = dto.Ime,
                Prezime = dto.Prezime,
                DatumRodjenja = dto.DatumRodjenja
            };
            _Context.Reziseri.Add(reziser);
            await _Context.SaveChangesAsync();
            return new ReziserDto
            {
                Id = reziser.Id,
                Ime = reziser.Ime,
                Prezime = reziser.Prezime,
                DatumRodjenja = reziser.DatumRodjenja
            };
        }

        public async Task<ReziserDto?> AzurirajAsync(Guid id, KreirajReziserDto dto)
        {
            var reziser = _Context.Reziseri.Find(id);
            if (reziser == null) return null;

            reziser.Ime = dto.Ime;
            reziser.Prezime = dto.Prezime;
            reziser.DatumRodjenja = dto.DatumRodjenja;
            await _Context.SaveChangesAsync();
            return new ReziserDto
            {
                Id = reziser.Id,
                Ime = reziser.Ime,
                Prezime = reziser.Prezime,
                DatumRodjenja = reziser.DatumRodjenja
            };
        }

        public async Task<bool> ObrisiAsync(Guid id)
        {
            var reziser = await _Context.Reziseri.FindAsync(id);
            if (reziser == null) return false;
            _Context.Reziseri.Remove(reziser);
            await _Context.SaveChangesAsync();
            return true;
        }
    }
}
