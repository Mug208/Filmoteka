using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.CompilerServices;

namespace Filmoteka.Server.Models
{
    [Table("Projekcije")]
    public class Projekcija
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [Column("FilmId")]
        public Guid FilmId { get; set; }

        [ForeignKey("FilmId")]
        public Film? Film {  get; set; }

        [Required]
        [Column("SalaId")]
        public Guid SalaId { get; set; }

        [ForeignKey("SalaId")]
        public Sala? Sala { get; set; }

        [Required(ErrorMessage = "Vreme pocetka je obavezno polje")]
        [Column("VremePocetka")]
        public DateTime VremePocetka { get; set; }

        [Required(ErrorMessage = "Vreme zavrsetka je obavezno polje")]
        [Column("VremeZavrsetka")]
        public DateTime VremeZavrsetka { get; set; }

        [Required]
        [Column("DostupnaMesta")]
        public int DostupnaMesta { get; set; }

        public List<Rezervacija> Rezervacije { get; set; } = new List<Rezervacija>();
    }
}
