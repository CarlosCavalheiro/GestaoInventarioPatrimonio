using System.ComponentModel.DataAnnotations;

namespace InventarioApi.DTOs
{
    public class PatrimonioDto
    {
        public int Id { get; set; }

        [Required]
        public string NumeroPatrimonio { get; set; }

        [Required]
        public string DescricaoEquipamento { get; set; }

        public int? LocalId { get; set; }
    }
}