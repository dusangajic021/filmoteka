namespace Filmoteka.API.Models
{
    public class Sala
    {
        public int Id { get; set; }
        public required string Naziv { get; set; }
        public int Kapacitet { get; set; }
        public required string Tip { get; set; } // Npr. Standard, 3D, IMAX
    }
}