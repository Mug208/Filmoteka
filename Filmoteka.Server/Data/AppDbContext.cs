using Filmoteka.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace Filmoteka.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<Film> Filmovi { get; set; }
        public DbSet<Reziser> Reziseri { get; set; }
        public DbSet<Zanr> Zanrovi { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Film>()
                .HasMany(e => e.Reziseri)
                .WithMany(n => n.Filmovi)
                .UsingEntity(f => f.ToTable("FilmReziser"));
        }
    }
}
