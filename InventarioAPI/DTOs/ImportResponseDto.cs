namespace InventarioAPI.DTOs
{
    public class ImportResponseDto
    {
        public int LocaisImportados { get; set; }
        public int PatrimoniosImportados { get; set; }
        public int LocaisIgnorados { get; set; }
        public int PatrimoniosIgnorados { get; set; }
    }
}