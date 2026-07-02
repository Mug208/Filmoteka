using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Filmoteka.Server.Models
{
    public enum StatusKorisnika
    {
        NaCekanju,
        Odobren
    }

    public enum UlogaKorisnika
    {
        Korisnik,
        Zaposleni,
        Admin
    }

    [Table("Korisnici")]
    public class Korisnik
    {
        [Key]
        public Guid Id { get; set; }

        [Required, StringLength(63)]
        public string Ime { get; set; } = string.Empty;

        [Required, EmailAddress, StringLength(83)]
        public string Email { get; set; } = string.Empty;

        [Required, StringLength(50)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string Lozinka { get; set; } = string.Empty;

        public StatusKorisnika Status { get; set; } = StatusKorisnika.NaCekanju;
        public UlogaKorisnika Uloga { get; set; } = UlogaKorisnika.Korisnik;
    }
}