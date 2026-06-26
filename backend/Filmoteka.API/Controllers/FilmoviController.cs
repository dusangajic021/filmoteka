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

        // 1. GET: api/filmovi (Sada sa pretragom, filterima i paginacijom!)
        [HttpGet]
        public async Task<ActionResult<object>> GetFilmovi(
            [FromQuery] string? pretraga,
            [FromQuery] int? zanrId,
            [FromQuery] int? godina,
            [FromQuery] bool? uBioskopima,
            [FromQuery] int stranica = 1,
            [FromQuery] int poStranici = 10)
        {
            // Krenemo od svih filmova
            var query = _context.Filmovi.Include(f => f.Zanr).AsQueryable();

            // 1. PRETRAGA (Live Search po naslovu i opisu - bonus ispunjen)
            if (!string.IsNullOrWhiteSpace(pretraga))
            {
                query = query.Where(f => f.Naslov.Contains(pretraga) || (f.Opis != null && f.Opis.Contains(pretraga)));
            }

            // 2. FILTRIRANJE (Žanr, Godina, Bioskop)
            if (zanrId.HasValue)
            {
                query = query.Where(f => f.ZanrId == zanrId.Value);
            }
            if (godina.HasValue)
            {
                query = query.Where(f => f.GodinaIzdanja == godina.Value);
            }
            if (uBioskopima.HasValue)
            {
                query = query.Where(f => f.UBioskopima == uBioskopima.Value);
            }

            // 3. PAGINACIJA
            var ukupanBroj = await query.CountAsync();
            var ukupnoStranica = (int)Math.Ceiling(ukupanBroj / (double)poStranici);

            // Preskačemo prethodne stranice i uzimamo samo onoliko koliko staje na jednu
            var filmovi = await query
                .Skip((stranica - 1) * poStranici)
                .Take(poStranici)
                .ToListAsync();

            // Vraćamo spakovan objekat kako bi React znao koliko ukupno ima stranica
            return Ok(new
            {
                Filmovi = filmovi,
                TrenutnaStranica = stranica,
                UkupnoStranica = ukupnoStranica,
                UkupanBrojFilmova = ukupanBroj
            });
        }

        // 2. POST: api/filmovi (Dodavanje ostaje isto)
        [HttpPost]
        public async Task<ActionResult<Film>> PostFilm(Film film)
        {
            _context.Filmovi.Add(film);
            await _context.SaveChangesAsync();

            return Ok(film);
        }
    }
}