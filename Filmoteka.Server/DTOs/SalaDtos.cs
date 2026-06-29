using System.ComponentModel.DataAnnotations;

namespace Filmoteka.Server.DTOs
{
    public class SalaDto
    {
        public Guid Id { get; set; }
        public string Naziv {  get; set; } = string.Empty;
        public int Kapacitet { get; set; }
        public string Tip { get; set; } = string.Empty;
        public bool ImaProjekcije { get; set; } 
    }

    public class NapraviSalaDto
    {
        [Required(ErrorMessage = "Naziv sale je obavezno polje")]
        [StringLength(50)]
        public string Naziv { get; set; } = string.Empty;

        [Range(1, 1000)]
        public int Kapacitet { get; set; }

        [Required]
        public string Tip { get; set; } = "Standard";
    }
}
