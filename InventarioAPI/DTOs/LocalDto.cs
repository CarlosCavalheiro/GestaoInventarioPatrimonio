using System.ComponentModel.DataAnnotations;

namespace InventarioAPI.DTOs
{
    public class LocalDto
    {
        public int Id { get; set; }

        [Required]
        public string CodigoLocal { get; set; }

        [Required]
        public string NomeLocal { get; set; }

        public int? ResponsavelId { get; set; }
    }
}