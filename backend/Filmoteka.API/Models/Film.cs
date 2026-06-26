namespace Filmoteka.API.Models
{
    public class Film
    {
        public int Id { get; set; }
        public required string Naslov { get; set; }
        public int GodinaIzdanja { get; set; }

        // Nova polja za pretragu i filtriranje
        public string? Opis { get; set; }
        public bool UBioskopima { get; set; }

        public int ZanrId { get; set; }
        public Zanr? Zanr { get; set; }
    }
}