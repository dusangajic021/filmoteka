namespace Filmoteka.API.Models
{
    public class Rezervacija
    {
        public int Id { get; set; }

        // Pošto nemamo pravih korisnika (login), samo ćemo tražiti da čovek upiše ime kad rezerviše
        public required string ImeKorisnika { get; set; }

        public int ProjekcijaId { get; set; }
        public Projekcija? Projekcija { get; set; }
    }
}