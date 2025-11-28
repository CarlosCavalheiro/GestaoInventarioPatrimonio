namespace InventarioAPI.DTOs
{
    public class DashboardConferenciasDto
    {
        public int LocalId { get; set; }
        public string NomeLocal { get; set; }
        public string NomeCompleto { get; set; }
        public int TotalItens { get; set; }
        public int TotalItensConferidos { get; set; }
        public int TotalInconsistencias { get; set; }
        public int TotalJustificados { get; set; }
        public int TotalItensForaPatrimonio { get; set; }

    }
}