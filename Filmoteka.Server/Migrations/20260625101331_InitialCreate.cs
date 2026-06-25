using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Filmoteka.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Reziseri",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ImeRezisera = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PrezimeRezisera = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DatumRodjenja = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Reziseri", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Zanrovi",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NazivZanra = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Zanrovi", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Filmovi",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    NazivFilma = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    GodinaFilma = table.Column<int>(type: "int", nullable: false),
                    OpisFilma = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ZanrId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Filmovi", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Filmovi_Zanrovi_ZanrId",
                        column: x => x.ZanrId,
                        principalTable: "Zanrovi",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FilmReziser",
                columns: table => new
                {
                    FilmoviId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ReziseriId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FilmReziser", x => new { x.FilmoviId, x.ReziseriId });
                    table.ForeignKey(
                        name: "FK_FilmReziser_Filmovi_FilmoviId",
                        column: x => x.FilmoviId,
                        principalTable: "Filmovi",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FilmReziser_Reziseri_ReziseriId",
                        column: x => x.ReziseriId,
                        principalTable: "Reziseri",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Filmovi_ZanrId",
                table: "Filmovi",
                column: "ZanrId");

            migrationBuilder.CreateIndex(
                name: "IX_FilmReziser_ReziseriId",
                table: "FilmReziser",
                column: "ReziseriId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FilmReziser");

            migrationBuilder.DropTable(
                name: "Filmovi");

            migrationBuilder.DropTable(
                name: "Reziseri");

            migrationBuilder.DropTable(
                name: "Zanrovi");
        }
    }
}
