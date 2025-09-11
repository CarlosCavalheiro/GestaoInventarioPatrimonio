using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventarioApi.Models
{
    [Table("itensconferidos")]
    public class ItemConferido
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column("sessao_id")]
        [ForeignKey("SessaoConferencia")]
        public int SessaoId { get; set; }
        public SessaoConferencia SessaoConferencia { get; set; }

        [Column("patrimonio_id")]
        [ForeignKey("Patrimonio")]
        public int? PatrimonioId { get; set; }
        public Patrimonio Patrimonio { get; set; }

        [Column("identificacao_ni")]        
        public string IdentificacaoNI { get; set; }

        [Column("patrimonio_nome")]        
        public string PatrimonioNome { get; set; }

        [Required]
        [Column("local_encontrado_id")]
        [ForeignKey("Local")]
        public int LocalEncontradoId { get; set; }
        public Local LocalEncontrado { get; set; }

        [Required]
        [Column("status")]
        public string Status { get; set; }

        [Required]
        [Column("leitura_tipo")]
        public string LeituraTipo { get; set; }

        [Required]
        [Column("placa_identificacao_ok")]
        public bool PlacaIdentificacaoOk { get; set; }

        [Column("observacao")]
        public string Observacao { get; set; }

        [Column("foto_url")]
        public string FotoUrl { get; set; }

        [Required]
        [Column("data_hora_conferencia")]
        public DateTime DataHoraConferencia { get; set; }
        
        [Column("conferido_por_id")]
        [ForeignKey("ConferidoPor")]
        public int? ConferidoPorId { get; set; }
        public Usuario ConferidoPor { get; set; }
    }
}