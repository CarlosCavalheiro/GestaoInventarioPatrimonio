using Microsoft.AspNetCore.Mvc;
using InventarioApi.DTOs;
using BCrypt.Net;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using InventarioAPI.Data;
using InventarioAPI.DTOs;

namespace InventarioAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly InventarioDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(InventarioDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Usuarios.FirstOrDefaultAsync(u => u.NomeUsuario == request.NomeUsuario);            

            var jwtKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(jwtKey))
            {
                return StatusCode(500, new { message = "Chave JWT não configurada no appsettings.json." });
            }

            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Senha, user.SenhaHash))
            {
                return Unauthorized(new { message = "Credenciais inválidas." });
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(jwtKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, user.NomeUsuario),
                    new Claim(ClaimTypes.Role, user.Perfil),
                    new Claim(ClaimTypes.GivenName, user.NomeCompleto),                    
                    new Claim("userId", user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            return Ok(new TokenResponse { Token = tokenString });
        }
    }
}