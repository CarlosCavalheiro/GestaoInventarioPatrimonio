using System.ComponentModel.DataAnnotations;

namespace InventarioAPI.DTOs
{
    public class UserUpdateDto
    {
        public int Id { get; set; }

        [Required]
        public string NomeUsuario { get; set; }
        
        public string NomeCompleto { get; set; }

        public string Senha { get; set; }
        
        [Required]
        public string Perfil { get; set; }
    }
}