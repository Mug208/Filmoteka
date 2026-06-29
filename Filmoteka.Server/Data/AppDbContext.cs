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
        public DbSet<Zanr> Zanrovi { get; set; }
        public DbSet<Reziser> Reziseri { get; set; }
        public DbSet<Sala> Sale { get; set; }
        public DbSet<Projekcija> Projekcije { get; set; }
        public DbSet<Rezervacija> Rezervacije { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Film>()
                .HasMany(f => f.Reziseri)
                .WithMany(r => r.Filmovi)
                .UsingEntity(j => j.ToTable("FilmReziser"));

            modelBuilder.Entity<Sala>()
                .HasIndex(s => s.Naziv)
                .IsUnique();
        }
    }
}