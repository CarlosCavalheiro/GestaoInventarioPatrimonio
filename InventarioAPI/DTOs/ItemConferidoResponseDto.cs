namespace InventarioAPI.DTOs
{
    public class ItemConferidoResponseDto
    {
        public int Id { get; set; }
        public int SessaoId { get; set; }
        public string? NumeroPatrimonio { get; set; }                
        public string PatrimonioNome { get; set; }                        
        public int? ConferidoPorId { get; set; }                        
        public string? ConferidoPorNome { get; set; }      
        public int LocalEncontradoId { get; set; }
        public string? LocalEncontradoNome { get; set; }
        public string? LocalEsperadoNome { get; set; }
        public bool PlacaIdentificacaoOk { get; set; }
        public string? Observacao { get; set; }
        public string FotoUrl { get; set; }
        public string Status { get; set; }
        public string LeituraTipo { get; set; }
        public DateTime DataHoraConferencia { get; set; }
    }
}