using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace InventarioAPI.DTOs
{
    public class InventarioItemRequest
    {
        [Required]
        public int sessaoId { get; set; }

        public string numeroPatrimonio { get; set; }

        [Required]
        public int localEncontradoId { get; set; }

        [Required]
        public bool placaIdentificacaoOk { get; set; }
        
        public string? observacao { get; set; }
        
        public IFormFile? foto { get; set; }
    }
}