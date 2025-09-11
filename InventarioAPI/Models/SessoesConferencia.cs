using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventarioApi.Models
{
    [Table("sessoesconferencia")]
    public class SessaoConferencia
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column("data_inicio")]
        public DateTime DataInicio { get; set; }

        [Column("data_fim")]
        public DateTime? DataFim { get; set; }

        [Required]
        [Column("status")]
        public string Status { get; set; }

        [Column("iniciada_por")]
        public int? IniciadaPorId { get; set; }
        public Usuario IniciadaPor { get; set; }

        // Relacionamentos
        public ICollection<ItemConferido> ItensConferidos { get; set; }
    }
}
