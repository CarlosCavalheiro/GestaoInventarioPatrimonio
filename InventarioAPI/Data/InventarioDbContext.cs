using InventarioAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace InventarioAPI.Data
{
    public class InventarioDbContext : DbContext
    {
        public InventarioDbContext(DbContextOptions<InventarioDbContext> options) : base(options)
        {
        }

        public DbSet<Local> Locais { get; set; }
        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Patrimonio> Patrimonios { get; set; }
        public DbSet<SessaoConferencia> SessoesConferencia { get; set; }
        public DbSet<ItemConferido> ItensConferidos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Relacionamento Usuario (Responsável) -> Local
            modelBuilder.Entity<Local>()
                .HasOne(l => l.Responsavel)
                .WithMany(u => u.LocaisResponsaveis)
                .HasForeignKey(l => l.ResponsavelId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relacionamento SessaoConferencia -> Usuario (IniciadaPor)
            modelBuilder.Entity<SessaoConferencia>()
                .HasOne(s => s.IniciadaPor)
                .WithMany(u => u.SessoesConferencia)
                .HasForeignKey(s => s.IniciadaPorId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
