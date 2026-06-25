using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Filmoteka.Server.Models
{
    [Table("Zanrovi")]
    public class Zanr
    {
        [Key]
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Naziv žanra je obavezan.")]
        [StringLength(100, ErrorMessage = "Naziv žanra ne može biti duži od 100 karaktera.")]
        [Column("NazivZanra")]
        public string Naziv { get; set; } = string.Empty;

        public List<Film> Filmovi { get; set; } = new List<Film>();
    }
}
