using System.ComponentModel.DataAnnotations;

namespace Filmoteka.API.DTOs
{
    // Koristi ga Admin za pravljenje sale
    public class NovaSalaDTO
    {
        [Required] public string Naziv { get; set; } = string.Empty;
        [Required] public int Kapacitet { get; set; }
        [Required] public string Tip { get; set; } = string.Empty;
    }

    // Koristi ga Zaposleni za kreiranje termina
    public class NovaProjekcijaDTO
    {
        public int FilmId { get; set; }
        public int SalaId { get; set; }
        public DateTime VremePocetka { get; set; }
        public DateTime VremeZavrsetka { get; set; }
    }

    // Koristi ga Korisnik za kupovinu karte
    public class NovaRezervacijaDTO
    {
        [Required] public string ImeKorisnika { get; set; } = string.Empty;
        public int ProjekcijaId { get; set; }
    }
}