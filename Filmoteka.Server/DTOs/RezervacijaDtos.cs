using System.ComponentModel.DataAnnotations;

namespace Filmoteka.Server.DTOs
{
    public class RezervacijaDto
    {
        public Guid Id { get; set; }
        public Guid ProjekcijaId { get; set; }
        public string KorisnikIme { get; set; } = string.Empty;
        public string KorisnikEmail { get; set; } = string.Empty;
        public DateTime DatumRezervacije { get; set; }
        public ProjekcijaDto? Projekcija { get; set; }
    }

    public class NapraviRezervacijaDto
    {
        [Required]
        public Guid ProjekcijaId { get; set; }

        [Required(ErrorMessage = "Korisnicko ime je obavezno polje")]
        [StringLength(60)]
        public string KorisnikIme { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email je obavezno polje")]
        [EmailAddress]
        public string KorisnikEmail { get; set; } = string.Empty;
    }
}
