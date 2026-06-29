using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Filmoteka.Server.Models
{
    [Table("Rezervacije")]
    public class Rezervacija
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [Column("ProjekcijaId")]
        public Guid ProjekcijaId { get; set; }

        [ForeignKey("ProjekcijaId")]
        public Projekcija? Projekcija { get; set; }

        [Required(ErrorMessage = "Ime korisnika je obavezno polje")]
        [StringLength(63, ErrorMessage= "Ime ne sme biti duzi od 63 karaktera")]
        [Column("KorisnikIme")]
        public string KorisnikIme { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email korisnika je obavezno polje")]
        [StringLength(83, ErrorMessage = "Email ne sme biti duzi od 83 karaktera")]
        [EmailAddress(ErrorMessage = "Neispravan format za email adrese")]
        [Column("KorisnikEmail")]
        public string KorisnikEmail { get; set; } = string.Empty;

        [Column("DatumRezervacije")]
        public DateTime DatumRezervacije { get; set; } = DateTime.UtcNow;
    }
}
