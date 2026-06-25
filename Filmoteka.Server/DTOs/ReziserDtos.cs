using System.ComponentModel.DataAnnotations;

namespace Filmoteka.Server.DTOs
{
    public class ReziserDto
    {
        public Guid Id { get; set; }
        public string Ime { get; set; } = string.Empty;
        public string Prezime { get; set; } = string.Empty;
        public DateTime? DatumRodjenja { get; set; }

        public string PunoIme => $"{Ime} {Prezime}";
    }

    public class KreirajReziserDto
    {
        [Required(ErrorMessage = "Ime je obavezno polje.")]
        [StringLength(100, ErrorMessage = "Ime ne može biti duže od 100 karaktera.")]
        public string Ime { get; set; } = string.Empty;
        [Required(ErrorMessage = "Prezime je obavezno polje.")]
        [StringLength(100, ErrorMessage = "Prezime ne može biti duže od 100 karaktera.")]
        public string Prezime { get; set; } = string.Empty;
        public DateTime? DatumRodjenja { get; set; }
    }
}
