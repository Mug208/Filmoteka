using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Filmoteka.Server.Models
{
    [Table("Reziseri")]

    public class Reziser
    {
        [Key]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Ime rezisera je obavezno.")]
        [StringLength(100, ErrorMessage = "Ime ne može biti duže od 100 karaktera.")]
        [Column("ImeRezisera")]
        public string Ime { get; set; } = string.Empty;

        [Required(ErrorMessage = "Prezime rezisera je obavezno.")]
        [StringLength(100, ErrorMessage = "Prezime ne može biti duže od 100 karaktera.")]
        [Column("PrezimeRezisera")]
        public string Prezime { get; set; } = string.Empty;

        [Column("DatumRodjenja")]
        [DataType(DataType.Date)]
        public DateTime? DatumRodjenja { get; set; }

        public List<Film> Filmovi { get; set; } = new List<Film>();
    }
}
