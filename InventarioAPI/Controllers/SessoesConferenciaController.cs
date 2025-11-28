using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using InventarioAPI.Data;
using InventarioAPI.Models;

namespace InventarioApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SessoesConferenciaController : ControllerBase
    {
        private readonly InventarioDbContext _context;

        public SessoesConferenciaController(InventarioDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Authorize(Roles = "administrador")]
        public async Task<ActionResult<IEnumerable<SessaoConferencia>>> GetSessoes()
        {
            return await _context.SessoesConferencia.OrderByDescending(s => s.DataInicio).ToListAsync();
        }

        [HttpPost("iniciar")]
        [Authorize(Roles = "administrador")]
        public async Task<ActionResult<SessaoConferencia>> IniciarSessao([FromQuery] int userId)
        {
            var sessao = new SessaoConferencia
            {
                DataInicio = DateTime.Now,
                Status = "ativa",
                IniciadaPorId = userId
            };
            _context.SessoesConferencia.Add(sessao);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(IniciarSessao), new { id = sessao.Id }, sessao);
        }

        [HttpGet("ativa")]
        [Authorize]
        public async Task<ActionResult<int?>> GetSessaoAtivaId()
        {
            var sessao = await _context.SessoesConferencia
                .FirstOrDefaultAsync(s => s.Status == "ativa");

            return Ok(sessao?.Id);
        }
    }
}