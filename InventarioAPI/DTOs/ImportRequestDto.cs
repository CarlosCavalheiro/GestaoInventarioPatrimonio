using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace InventarioAPI.DTOs
{
    public class ImportRequestDto
    {
        [Required]
        public IFormFile Locais { get; set; }

        [Required]
        public IFormFile Patrimonios { get; set; }
    }
}