namespace Filmoteka.Server.Services.Email
{
    public interface IEmailService
    {
        Task PosaljiPodsetnikAsync(string email, string ime, string film, DateTime vreme, string sala);
        Task PosaljiPotvrduRegistracijeAsync(string email, string ime, string username);
        Task PosaljiOtkazivanjeAsync(string email, string ime, string film, DateTime vreme);
    }
}