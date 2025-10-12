using CsvHelper.Configuration.Attributes;

namespace InventarioAPI.DTOs
{
    public class LocalCsvDto
    {
        [Name("CodLocal")]
        public string CodLocal { get; set; }

        [Name("Local")]
        public string NomeLocal { get; set; }

        [Name("Responsavel")]
        public string Responsavel { get; set; }

    }
}