using System.ComponentModel.DataAnnotations;

namespace InventarioAPI.DTOs
{
    public class JustifyItemDto
    {
        [Required]
        public int SessaoId { get; set; }
        
        [Required]
        public string NumeroPatrimonio { get; set; }
        
        [Required]
        public int LocalEncontradoId { get; set; }
        
        [Required]
        public string Justificativa { get; set; }
    }
}