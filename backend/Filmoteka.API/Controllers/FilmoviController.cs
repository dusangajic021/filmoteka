using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Filmoteka.API.Data;
using Filmoteka.API.Models;

namespace Filmoteka.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FilmoviController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FilmoviController(AppDbContext context)
        {
            _context = context;
        }

        // 1. GET: api/filmovi (Vraća sve filmove)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Film>>> GetFilmovi()
        {
            // Dobačimo filmove i odmah uključimo i podatke o žanru
            var filmovi = await _context.Filmovi.Include(f => f.Zanr).ToListAsync();
            return Ok(filmovi);
        }

        // 2. POST: api/filmovi (Dodaje novi film)
        [HttpPost]
        public async Task<ActionResult<Film>> PostFilm(Film film)
        {
            _context.Filmovi.Add(film);
            await _context.SaveChangesAsync();

            return Ok(film);
        }
    }
}