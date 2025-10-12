namespace InventarioAPI.DTOs
{
    public class LocalListDto
    {
        public int Id { get; set; }
        public string CodigoLocal { get; set; }
        public string NomeLocal { get; set; }
        public string ResponsavelNomeCompleto { get; set; }
        public int TotalPatrimonios { get; set; }
        public int ItensConferidos { get; set; }
        public int TotalInconsistencias { get; set; }        
        public int TotalJustificados { get; set; }
        public int TotalItensForaPatrimonio { get; set; }

    }
}