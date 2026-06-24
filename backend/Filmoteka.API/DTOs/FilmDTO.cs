namespace Filmoteka.API.DTOs
{
    public class FilmDTO
    {
        public int Id { get; set; }
        public required string Naslov { get; set; }
        public int GodinaIzdanja { get; set; }
        public int ZanrId { get; set; }
    }
}