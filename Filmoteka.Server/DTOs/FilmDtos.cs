using System.ComponentModel.DataAnnotations;

namespace Filmoteka.Server.DTOs
{
    public class FilmDto
    {
        public Guid Id { get; set; }
        public string Naziv { get; set; } = string.Empty;
        public int Godina { get; set; }
        public string? Opis { get; set; }
        public bool DostupnoUBioskopu { get; set; }
        public ZanrDto? Zanr { get; set; }
        public List<ReziserDto> Reziseri { get; set; } = new List<ReziserDto>();
    }

    public class KreirajFilmDto
    {
        [Required(ErrorMessage = "Naziv je obavezno polje.")]
        public string Naziv { get; set; } = string.Empty;
        [Range(1900, 2100, ErrorMessage = "Godina mora biti između 1900. i 2100.")]
        public int Godina { get; set; }
        [StringLength(1000, ErrorMessage = "Opis ne može biti duži od 1000 karaktera.")]
        public string? Opis { get; set; }
        [Required(ErrorMessage = "ZanrId je obavezno polje.")]
        public Guid ZanrId { get; set; }
        public bool DostupnoUBioskopu { get; set; }

        public List<Guid> ReziseriIds { get; set; } = new();
    }

    public class AzurirajFilmDto : KreirajFilmDto { }
}
