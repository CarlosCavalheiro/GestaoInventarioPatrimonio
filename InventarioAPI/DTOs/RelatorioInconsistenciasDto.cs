using System.Collections.Generic;

namespace InventarioAPI.DTOs
{
    public class RelatorioInconsistenciasDto
    {
        public int SessaoId { get; set; }
        public int TotalPatrimoniosEsperados { get; set; }
        public int TotalPatrimoniosEncontrados { get; set; }
        public int TotalPatrimoniosNaoEncontrados { get; set; }
        public int TotalInconsistenciasLocal { get; set; }
        public int TotalItensForaPatrimonio { get; set; }
        public List<PatrimonioNaoEncontradoDto> PatrimoniosNaoEncontrados { get; set; }
        public List<InconsistenciaLocalItemDto> InconsistenciasLocal { get; set; }
    }

    public class InconsistenciaLocalItemDto
    {
        public string? NumeroPatrimonio { get; set; }
        public string? PatrimonioNome { get; set; }
        public string? LocalEsperado { get; set; }
        public string? LocalEncontrado { get; set; }
    }

    public class InconsistenciaMeuLocalItemDto
    {
        public string? NumeroPatrimonio { get; set; }
        public string? PatrimonioNome { get; set; }
        public string? LocalEsperado { get; set; }
        public string? LocalEncontrado { get; set; }
        public int? ConferidoPorId { get; set; }
        public string? ConferidoPorNome { get; set; }

    }
}