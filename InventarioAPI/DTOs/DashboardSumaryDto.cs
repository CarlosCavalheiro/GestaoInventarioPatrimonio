namespace InventarioAPI.DTOs
{
    public class DashboardSummaryDto
    {
        public int TotalPatrimonios { get; set; }
        public int TotalLocais { get; set; }
        public int TotalResponsaveis { get; set; }
        public int TotalItensConferidos { get; set; }
        public int TotalInconsistencias { get; set; }
        public int TotalItensForaPatrimonio { get; set; }
    }
}