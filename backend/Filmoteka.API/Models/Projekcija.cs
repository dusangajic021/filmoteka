namespace Filmoteka.API.Models
{
    public class Projekcija
    {
        public int Id { get; set; }
        public DateTime VremePocetka { get; set; }
        public DateTime VremeZavrsetka { get; set; }
        public int DostupnoMesta { get; set; }

        // Strani ključevi koji spajaju ovu projekciju sa konkretnim filmom i salom
        public int FilmId { get; set; }
        public Film? Film { get; set; }

        public int SalaId { get; set; }
        public Sala? Sala { get; set; }
    }
}