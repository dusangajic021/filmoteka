using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Filmoteka.API.Data;
using Filmoteka.API.Models;
using Filmoteka.API.DTOs;

namespace Filmoteka.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjekcijeController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ProjekcijeController(AppDbContext context) { _context = context; }

        // GET: Dohvata samo one projekcije gde ima slobodnih mesta (za Korisnike)
        [HttpGet("dostupne")]
        public async Task<ActionResult> GetDostupneProjekcije()
        {
            var projekcije = await _context.Projekcije
                .Include(p => p.Film)
                .Include(p => p.Sala)
                .Where(p => p.DostupnoMesta > 0) // PRAVILO: Vide se samo one sa slobodnim mestima
                .Select(p => new {
                    p.Id,
                    Film = p.Film!.Naslov,
                    Sala = p.Sala!.Naziv,
                    p.VremePocetka,
                    p.VremeZavrsetka,
                    p.DostupnoMesta
                }).ToListAsync();

            return Ok(projekcije);
        }

        [HttpPost]
        public async Task<ActionResult> DodajProjekciju([FromBody] NovaProjekcijaDTO dto)
        {
            var sala = await _context.Sale.FindAsync(dto.SalaId);
            if (sala == null) return NotFound("Sala ne postoji.");

            // PRAVILO 2: Preklapanje + 15 minuta pauze.
            // Matematički gledano, novi film upada u postojeći ako njegov KRAJ zadire 15 minuta u početak starog, ili obrnuto.
            bool preklapanje = await _context.Projekcije.AnyAsync(p =>
                p.SalaId == dto.SalaId &&
                dto.VremeZavrsetka > p.VremePocetka.AddMinutes(-15) &&
                dto.VremePocetka < p.VremeZavrsetka.AddMinutes(15)
            );

            if (preklapanje)
                return BadRequest("Termin se preklapa sa postojećom projekcijom ili nema 15 min pauze!");

            var projekcija = new Projekcija
            {
                FilmId = dto.FilmId,
                SalaId = dto.SalaId,
                VremePocetka = dto.VremePocetka,
                VremeZavrsetka = dto.VremeZavrsetka,
                DostupnoMesta = sala.Kapacitet // PRAVILO 3: Mesta = Kapacitet sale
            };

            _context.Projekcije.Add(projekcija);
            await _context.SaveChangesAsync();
            return Ok(projekcija);
        }
    }
}