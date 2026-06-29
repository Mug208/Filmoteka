using System.ComponentModel.DataAnnotations;

namespace Filmoteka.Server.DTOs
{
    public class ProjekcijaDto
    {
        public Guid Id { get; set; }
        public FilmDto? Film { get; set; }
        public SalaDto? Sala { get; set; }
        public DateTime VremePocetka { get; set; }
        public DateTime VremeZavrsetka { get; set; }
        public int DostupnaMesta { get; set; }
        public int UkupnoMesta { get; set; }
    }

    public class NapraviProjekcijaDto
    {
        [Required]
        public Guid FilmId { get; set; }
        [Required]
        public Guid SalaId { get; set; }
        [Required]
        public DateTime VremePocetka { get; set; }
        [Required]
        public DateTime VremeZavrsetka { get; set; }
    }
}
