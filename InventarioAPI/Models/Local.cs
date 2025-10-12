using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventarioAPI.Models
{
    [Table("locais")]
    public class Local
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(255)]
        [Column("codigo_local")]
        public string CodigoLocal { get; set; }

        [Column("nome_local")]
        public string NomeLocal { get; set; }

        [Column("responsavel_id")]
        public int? ResponsavelId { get; set; }
        public Usuario Responsavel { get; set; }

        // Relacionamentos
        public ICollection<Patrimonio> Patrimonios { get; set; }
        public ICollection<ItemConferido> ItensConferidos { get; set; }
    }
}
