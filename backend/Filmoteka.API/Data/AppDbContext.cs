using Microsoft.EntityFrameworkCore;
using Filmoteka.API.Models;

namespace Filmoteka.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        // Ove dve linije prave tabele u SQL-u
        public DbSet<Film> Filmovi { get; set; }
        public DbSet<Zanr> Zanrovi { get; set; }
    }
}