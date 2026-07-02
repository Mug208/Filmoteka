using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Filmoteka.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddEmailAndUserSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "PodsetnikPoslat",
                table: "Rezervacije",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Projekcije",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Korisnici",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Ime = table.Column<string>(type: "nvarchar(63)", maxLength: 63, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(83)", maxLength: 83, nullable: false),
                    Username = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Lozinka = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Uloga = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Korisnici", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Korisnici");

            migrationBuilder.DropColumn(
                name: "PodsetnikPoslat",
                table: "Rezervacije");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Projekcije");
        }
    }
}
