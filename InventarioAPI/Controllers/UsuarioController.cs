using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using System.Threading.Tasks;
using InventarioApi.DTOs;
using System.Linq;
using System.Security.Claims;
using InventarioAPI.Data;
using InventarioAPI.Models;
using InventarioAPI.DTOs;

namespace InventarioApi.Controllers
{
    [Authorize] // Autentica qualquer usuário
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly InventarioDbContext _context;

        public UsuariosController(InventarioDbContext context)
        {
            _context = context;
        }

        [HttpGet("me")]
        public async Task<ActionResult<Usuario>> GetCurrentUser()
        {
            // Obtém o ID do usuário a partir do token JWT
            var userIdString = User.FindFirst("userId")?.Value;
            if (userIdString == null)
            {
                return Unauthorized();
            }

            if (!int.TryParse(userIdString, out int userId))
            {
                return BadRequest();
            }

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (usuario == null)
            {
                return NotFound();
            }

            return Ok(usuario);
        }

        [HttpGet]
        [Authorize(Roles = "administrador")] 
        public async Task<ActionResult<IEnumerable<UserListDto>>> GetUsers()
        {
            var users = await _context.Usuarios
                .Select(u => new UserListDto
                {
                    Id = u.Id,
                    NomeUsuario = u.NomeUsuario,
                    NomeCompleto = u.NomeCompleto,
                    Perfil = u.Perfil
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPost]
        [Authorize(Roles = "administrador")]
        public async Task<ActionResult<Usuario>> CreateUser(UserCreateDto userDto)
        {
            var usuario = new Usuario
            {
                NomeUsuario = userDto.NomeUsuario,
                NomeCompleto = userDto.NomeCompleto,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(userDto.Senha),
                Perfil = userDto.Perfil,
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetUsers), new { id = usuario.Id }, usuario);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "administrador")]
        public async Task<IActionResult> UpdateUser(int id, UserUpdateDto userDto)
        {
            if (id != userDto.Id)
            {
                return BadRequest();
            }

            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }

            usuario.NomeUsuario = userDto.NomeUsuario;
            usuario.NomeCompleto = userDto.NomeCompleto;
            usuario.Perfil = userDto.Perfil;

            if (!string.IsNullOrEmpty(userDto.Senha))
            {
                usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(userDto.Senha);
            }

            _context.Entry(usuario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "administrador")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var usuario = await _context.Usuarios.FindAsync(id);
            if (usuario == null)
            {
                return NotFound();
            }

            _context.Usuarios.Remove(usuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Usuarios.Any(e => e.Id == id);
        }
    }
}