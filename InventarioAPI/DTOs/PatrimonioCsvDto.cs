using CsvHelper.Configuration.Attributes;

namespace InventarioApi.DTOs
{
    public class PatrimonioCsvDto
    {
        [Name("NI")]
        public string NI { get; set; }

        [Name("Nome Equipamento")]
        public string NomeEquipamento { get; set; }

        [Name("CodLocal")]
        public string CodLocal { get; set; }
    }
}