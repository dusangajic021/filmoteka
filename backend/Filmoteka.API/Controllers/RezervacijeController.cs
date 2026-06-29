using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Filmoteka.API.Data;
using Filmoteka.API.Models;
using Filmoteka.API.DTOs;

namespace Filmoteka.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RezervacijeController : ControllerBase
    {
        private readonly AppDbContext _context;
        public RezervacijeController(AppDbContext context) { _context = context; }

        [HttpPost]
        public async Task<ActionResult> NapraviRezervaciju([FromBody] NovaRezervacijaDTO dto)
        {
            var projekcija = await _context.Projekcije.FindAsync(dto.ProjekcijaId);
            if (projekcija == null) return NotFound("Projekcija nije nađena.");

            // PRAVILO 1: Nema prijave ako su sva mesta popunjena
            if (projekcija.DostupnoMesta <= 0)
                return BadRequest("Nažalost, sva mesta su rasprodata.");

            // PRAVILO 2: Jedan korisnik = jedno mesto
            bool vecImaKartu = await _context.Rezervacije
                .AnyAsync(r => r.ProjekcijaId == dto.ProjekcijaId && r.ImeKorisnika.ToLower() == dto.ImeKorisnika.ToLower());

            if (vecImaKartu)
                return BadRequest("Već ste rezervisali kartu za ovaj film!");

            // Pravimo rezervaciju
            var rezervacija = new Rezervacija
            {
                ImeKorisnika = dto.ImeKorisnika,
                ProjekcijaId = dto.ProjekcijaId
            };

            // PRAVILO 3: Smanjujemo broj dostupnih mesta
            projekcija.DostupnoMesta--;

            _context.Rezervacije.Add(rezervacija);
            await _context.SaveChangesAsync();

            return Ok(new { Poruka = "Uspesno rezervisano!", MestaOstalo = projekcija.DostupnoMesta });
        }
    }
}