namespace Filmoteka.API.Models
{
    public class Film
    {
        public int Id { get; set; }
        public required string Naslov { get; set; }
        public int GodinaIzdanja { get; set; }

        // Strani ključ i veza ka Žanru
        public int ZanrId { get; set; }
        public Zanr? Zanr { get; set; }
    }
}