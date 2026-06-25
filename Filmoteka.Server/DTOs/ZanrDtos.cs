using System.ComponentModel.DataAnnotations;

namespace Filmoteka.Server.DTOs
{
    public class ZanrDto
    {
        public Guid Id { get; set; }
        public string Naziv { get; set; } = string.Empty;
    }

    public class KreirajZanrDto
    {
        [Required(ErrorMessage = "Naziv je obavezno polje.")]
        [StringLength(100, ErrorMessage = "Naziv ne može biti duži od 100 karaktera.")]
        public string Naziv { get; set; } = string.Empty;
    }
}
