using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace InventarioAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "usuarios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    nome_usuario = table.Column<string>(type: "longtext", nullable: false),
                    nome_completo = table.Column<string>(type: "longtext", nullable: false),
                    senha_hash = table.Column<string>(type: "longtext", nullable: false),
                    perfil = table.Column<string>(type: "longtext", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_usuarios", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "locais",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    codigo_local = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    nome_local = table.Column<string>(type: "longtext", nullable: false),
                    responsavel_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_locais", x => x.Id);
                    table.ForeignKey(
                        name: "FK_locais_usuarios_responsavel_id",
                        column: x => x.responsavel_id,
                        principalTable: "usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "sessoesconferencia",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    data_inicio = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    data_fim = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    status = table.Column<string>(type: "longtext", nullable: false),
                    iniciada_por = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sessoesconferencia", x => x.Id);
                    table.ForeignKey(
                        name: "FK_sessoesconferencia_usuarios_iniciada_por",
                        column: x => x.iniciada_por,
                        principalTable: "usuarios",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "patrimonios",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    numero_patrimonio = table.Column<string>(type: "longtext", nullable: false),
                    descricao_equipamento = table.Column<string>(type: "longtext", nullable: false),
                    local_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_patrimonios", x => x.Id);
                    table.ForeignKey(
                        name: "FK_patrimonios_locais_local_id",
                        column: x => x.local_id,
                        principalTable: "locais",
                        principalColumn: "Id");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "itensconferidos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    sessao_id = table.Column<int>(type: "int", nullable: false),
                    patrimonio_id = table.Column<int>(type: "int", nullable: true),
                    identificacao_ni = table.Column<string>(type: "longtext", nullable: false),
                    patrimonio_nome = table.Column<string>(type: "longtext", nullable: false),
                    local_encontrado_id = table.Column<int>(type: "int", nullable: false),
                    status = table.Column<string>(type: "longtext", nullable: false),
                    leitura_tipo = table.Column<string>(type: "longtext", nullable: false),
                    placa_identificacao_ok = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    observacao = table.Column<string>(type: "longtext", nullable: false),
                    foto_url = table.Column<string>(type: "longtext", nullable: false),
                    data_hora_conferencia = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    conferido_por_id = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_itensconferidos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_itensconferidos_locais_local_encontrado_id",
                        column: x => x.local_encontrado_id,
                        principalTable: "locais",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_itensconferidos_patrimonios_patrimonio_id",
                        column: x => x.patrimonio_id,
                        principalTable: "patrimonios",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_itensconferidos_sessoesconferencia_sessao_id",
                        column: x => x.sessao_id,
                        principalTable: "sessoesconferencia",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_itensconferidos_usuarios_conferido_por_id",
                        column: x => x.conferido_por_id,
                        principalTable: "usuarios",
                        principalColumn: "Id");
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_itensconferidos_conferido_por_id",
                table: "itensconferidos",
                column: "conferido_por_id");

            migrationBuilder.CreateIndex(
                name: "IX_itensconferidos_local_encontrado_id",
                table: "itensconferidos",
                column: "local_encontrado_id");

            migrationBuilder.CreateIndex(
                name: "IX_itensconferidos_patrimonio_id",
                table: "itensconferidos",
                column: "patrimonio_id");

            migrationBuilder.CreateIndex(
                name: "IX_itensconferidos_sessao_id",
                table: "itensconferidos",
                column: "sessao_id");

            migrationBuilder.CreateIndex(
                name: "IX_locais_responsavel_id",
                table: "locais",
                column: "responsavel_id");

            migrationBuilder.CreateIndex(
                name: "IX_patrimonios_local_id",
                table: "patrimonios",
                column: "local_id");

            migrationBuilder.CreateIndex(
                name: "IX_sessoesconferencia_iniciada_por",
                table: "sessoesconferencia",
                column: "iniciada_por");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "itensconferidos");

            migrationBuilder.DropTable(
                name: "patrimonios");

            migrationBuilder.DropTable(
                name: "sessoesconferencia");

            migrationBuilder.DropTable(
                name: "locais");

            migrationBuilder.DropTable(
                name: "usuarios");
        }
    }
}
