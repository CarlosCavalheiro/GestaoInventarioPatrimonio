namespace InventarioApi.DTOs
{
    public class PatrimonioListDto
    {
        public int Id { get; set; }
        public string NumeroPatrimonio { get; set; }
        public string DescricaoEquipamento { get; set; }
        public int? LocalId { get; set; }
        public string LocalNome { get; set; }
    }
}