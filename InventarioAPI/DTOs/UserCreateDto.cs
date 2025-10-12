using System.ComponentModel.DataAnnotations;

namespace InventarioAPI.DTOs
{
    public class UserCreateDto
    {
        [Required]
        public string NomeUsuario { get; set; }
        
        [Required]
        public string NomeCompleto { get; set; }

        [Required]
        public string Senha { get; set; }
        
        [Required]
        public string Perfil { get; set; }
    }
}