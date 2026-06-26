using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Filmoteka.API.Migrations
{
    /// <inheritdoc />
    public partial class PretragaIFiltriranje : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Opis",
                table: "Filmovi",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "UBioskopima",
                table: "Filmovi",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Opis",
                table: "Filmovi");

            migrationBuilder.DropColumn(
                name: "UBioskopima",
                table: "Filmovi");
        }
    }
}
