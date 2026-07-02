using Filmoteka.Server.Data;
using Filmoteka.Server.Services.Email;
using Microsoft.EntityFrameworkCore;

namespace Filmoteka.Server.Services
{
    public class PodsetnikService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<PodsetnikService> _logger;

        public PodsetnikService(IServiceProvider serviceProvider, ILogger<PodsetnikService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                    var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();

                    var sutra = DateTime.UtcNow.AddDays(1).Date;
                    var danas = DateTime.UtcNow.Date;

                    // Projekcije koje su sutra, a podsetnik nije poslat
                    var rezervacijeZaPodsetnik = await context.Rezervacije
                        .Include(r => r.Projekcija).ThenInclude(p => p.Film)
                        .Include(r => r.Projekcija).ThenInclude(p => p.Sala)
                        .Where(r => !r.PodsetnikPoslat
                                 && r.Projekcija.VremePocetka.Date == sutra
                                 && r.Projekcija.Status == Models.StatusProjekcije.Aktivna)
                        .ToListAsync(stoppingToken);

                    foreach (var r in rezervacijeZaPodsetnik)
                    {
                        await emailService.PosaljiPodsetnikAsync(r.KorisnikEmail, r.KorisnikIme, r.Projekcija.Film.Naziv, r.Projekcija.VremePocetka, r.Projekcija.Sala.Naziv);
                        r.PodsetnikPoslat = true;
                    }

                    if (rezervacijeZaPodsetnik.Any())
                        await context.SaveChangesAsync(stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Greška u PodsetnikService.");
                }

                // Čeka 1 sat pre sledeće provere
                await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
            }
        }
    }
}