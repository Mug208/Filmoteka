namespace Filmoteka.Server.DTOs
{
    public class PaginacijaResultatDto<T>
    {
        public IEnumerable<T> Items { get; set; } = new List<T>();
        public int TotalItems { get; set; }
        public int Stranica { get; set; }
        public int VelicinaStranice { get; set; }
        public int UkupnoStranica => (int)Math.Ceiling(TotalItems / (double)VelicinaStranice);
    }
}
