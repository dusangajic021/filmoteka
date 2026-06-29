using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Filmoteka.API.Data;
using Filmoteka.API.Models;
using Filmoteka.API.DTOs;

namespace Filmoteka.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SaleController : ControllerBase
    {
        private readonly AppDbContext _context;
        public SaleController(AppDbContext context) { _context = context; }

        [HttpGet]
        public async Task<ActionResult> GetSale()
        {
            return Ok(await _context.Sale.ToListAsync());
        }

        [HttpPost]
        public async Task<ActionResult> DodajSalu([FromBody] NovaSalaDTO dto)
        {
            // PRAVILO 1: Sala ne može imati isti naziv
            if (await _context.Sale.AnyAsync(s => s.Naziv == dto.Naziv))
                return BadRequest("Zabranjeno: Sala sa ovim nazivom već postoji!");

            var sala = new Sala { Naziv = dto.Naziv, Kapacitet = dto.Kapacitet, Tip = dto.Tip };
            _context.Sale.Add(sala);
            await _context.SaveChangesAsync();

            return Ok(sala);
        }
    }
}