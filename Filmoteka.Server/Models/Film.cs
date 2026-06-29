using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Filmoteka.Server.Models
{
    [Table("Filmovi")]
    public class Film
    {
        [Key]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Naziv filma je obavezan.")]
        [StringLength(100, ErrorMessage = "Naziv filma ne može biti duži od 100 karaktera.")]
        [Column("NazivFilma")]
        public string Naziv { get; set; } = string.Empty;

        [Required(ErrorMessage = "Godina filma je obavezna.")]
        [Range(1900, 2100, ErrorMessage = "Godina filma mora biti između 1900. i 2100.")]
        [Column("GodinaFilma")]
        public int Godina { get; set; }

        [StringLength(500, ErrorMessage = "Opis filma ne može biti duži od 500 karaktera.")]
        [Column("OpisFilma")]
        public string? Opis { get; set; }

        [Column("DostupnoUBioskopu")]
        public bool DostupnoUBioskopu { get; set; }

        [Required(ErrorMessage = "Zanr filma je obavezan.")]
        [Column("ZanrId")]
        public Guid ZanrId { get; set; }

        [ForeignKey("ZanrId")]
        public Zanr? Zanr { get; set; }

        public List<Reziser> Reziseri { get; set; } = new List<Reziser>();
    }
}
