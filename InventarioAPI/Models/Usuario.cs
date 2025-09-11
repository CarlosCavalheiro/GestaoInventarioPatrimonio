using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventarioApi.Models
{
    [Table("usuarios")]
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column("nome_usuario")]
        public string NomeUsuario { get; set; }

        [Column("nome_completo")]
        public string NomeCompleto { get; set; }

        [Required]
        [Column("senha_hash")]
        public string SenhaHash { get; set; }

        [Required]
        [Column("perfil")]
        public string Perfil { get; set; }

        // Relacionamentos
        public ICollection<SessaoConferencia> SessoesConferencia { get; set; }
        public ICollection<Local> LocaisResponsaveis { get; set; }
    }
}
