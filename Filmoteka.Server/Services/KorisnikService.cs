using Filmoteka.Server.Data;
using Filmoteka.Server.Models;
using Filmoteka.Server.Services.Email;
using Microsoft.EntityFrameworkCore;

namespace Filmoteka.Server.Services
{
    public interface IKorisnikService
    {
        Task PosaljiPotvrduAsync(string ime, string email, string username);
        Task OdobriKorisnikaAsync(Guid id);
    }

    public class KorisnikService : IKorisnikService
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;

        public KorisnikService(AppDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        public async Task PosaljiPotvrduAsync(string ime, string email, string username)
        {
            await _emailService.PosaljiPotvrduRegistracijeAsync(email, ime, username);
        }

        public async Task OdobriKorisnikaAsync(Guid id)
        {
            var korisnik = await _context.Korisnici.FindAsync(id);
            if (korisnik == null)
                throw new InvalidOperationException($"Korisnik sa ID {id} nije pronađen.");

            korisnik.Status = StatusKorisnika.Odobren;
            _context.Korisnici.Update(korisnik);
            await _context.SaveChangesAsync();
        }
    }
}