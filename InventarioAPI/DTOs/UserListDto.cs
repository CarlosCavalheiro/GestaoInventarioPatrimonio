namespace InventarioApi.DTOs
{
    public class UserListDto
    {
        public int Id { get; set; }
        public string NomeUsuario { get; set; }
        public string Perfil { get; set; }
        public string NomeCompleto { get; set; }
        public int? LocalId { get; set; }
    }
}