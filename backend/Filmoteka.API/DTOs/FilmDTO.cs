namespace Filmoteka.API.DTOs
{
    public class FilmDTO
    {
        public int Id { get; set; }
        public required string Naslov { get; set; }
        public int GodinaIzdanja { get; set; }
        public string? Opis { get; set; }
        public bool UBioskopima { get; set; }
        public int ZanrId { get; set; }
    }
}