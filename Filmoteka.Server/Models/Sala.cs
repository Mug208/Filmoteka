using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Filmoteka.Server.Models
{
    public enum TipSale
    {
        Standard,
        triD,
        IMAX
    }

    [Table("Sale")]
    public class Sala
    {
        [Key]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Naziv je uvek obavezno polje")]
        [StringLength(50, ErrorMessage = "Naziv sale ne sme biti duzi od 50 karaktera")]
        [Column("NazivSale")]
        public string Naziv {  get; set; } = string.Empty;

        [Required(ErrorMessage = "Kapacitet je obavezno polje")]
        [Range(1, 1000, ErrorMessage = "Kapacitet mora biti izmedju 1 i 1000")]
        [Column("KapacitetSale")]
        public int Kapacitet { get; set; }

        [Required(ErrorMessage = "Tip sale je obavezno polje")]
        [Column("TipSale")]
        public TipSale Tip {  get; set; }

        public List<Projekcija> Projekcije { get; set; } = new List<Projekcija>();
    }
}
