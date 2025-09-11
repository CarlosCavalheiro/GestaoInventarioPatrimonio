using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventarioApi.Models
{
    [Table("patrimonios")]
    public class Patrimonio
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column("numero_patrimonio")]
        public string NumeroPatrimonio { get; set; }

        [Column("descricao_equipamento")]
        public string DescricaoEquipamento { get; set; }

        [Column("local_id")]
        public int? LocalId { get; set; }
        public Local Local { get; set; }

        // Relacionamentos
        public ICollection<ItemConferido> ItensConferidos { get; set; }
    }
}
