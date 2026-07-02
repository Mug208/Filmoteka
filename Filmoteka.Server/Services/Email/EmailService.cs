using System.Net;
using System.Net.Mail;

namespace Filmoteka.Server.Services.Email
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task PosaljiEmailAsync(string to, string subject, string body)
        {
            var smtpHost = _config["Smtp:Host"] ?? "localhost";
            var smtpPort = int.Parse(_config["Smtp:Port"] ?? "25");
            var smtpUser = _config["Smtp:User"];
            var smtpPass = _config["Smtp:Pass"];
            var fromEmail = _config["Smtp:From"] ?? "no-reply@filmoteka.rs";

            using var client = new SmtpClient(smtpHost, smtpPort);
            if (!string.IsNullOrEmpty(smtpUser))
            {
                client.Credentials = new NetworkCredential(smtpUser, smtpPass);
                client.EnableSsl = true;
            }

            var mailMessage = new MailMessage
            {
                From = new MailAddress(fromEmail, "Filmoteka"),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            mailMessage.To.Add(to);

            await client.SendMailAsync(mailMessage);
        }

        public async Task PosaljiPodsetnikAsync(string email, string ime, string film, DateTime vreme, string sala)
        {
            var body = $"<h2>Pozdrav {ime},</h2><p>Ovo je podsetnik za vašu rezervaciju.</p><p><b>Film:</b> {film}<br><b>Vreme:</b> {vreme:dd.MM.yyyy HH:mm}<br><b>Sala:</b> {sala}</p>";
            await PosaljiEmailAsync(email, "Podsetnik: Projekcija sutra", body);
        }

        public async Task PosaljiPotvrduRegistracijeAsync(string email, string ime, string username)
        {
            var body = $"<h2>Dobrodošli {ime},</h2><p>Vaš nalog je odobren!</p><p><b>Korisničko ime:</b> {username}</p><p>Pravila rezervacije: Možete rezervisati jedno mesto po projekciji. Otkazivanje je moguće najkasnije 2 sata pre početka.</p>";
            await PosaljiEmailAsync(email, "Registracija Odobrena", body);
        }

        public async Task PosaljiOtkazivanjeAsync(string email, string ime, string film, DateTime vreme)
        {
            var body = $"<h2>Poštovani {ime},</h2><p>Obaveštavamo vas da je projekcija na koju ste rezervisali kartu otkazana.</p><p><b>Film:</b> {film}<br><b>Vreme:</b> {vreme:dd.MM.yyyy HH:mm}</p><p>Izvinjavamo se zbog neprijatnosti.</p>";
            await PosaljiEmailAsync(email, "Otkazivanje Projekcije", body);
        }
    }
}