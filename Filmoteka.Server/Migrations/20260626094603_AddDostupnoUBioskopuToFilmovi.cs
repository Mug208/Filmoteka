using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Filmoteka.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddDostupnoUBioskopuToFilmovi : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "DostupnoUBioskopu",
                table: "Filmovi",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DostupnoUBioskopu",
                table: "Filmovi");
        }
    }
}
