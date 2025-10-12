using Microsoft.AspNetCore.Mvc;
using InventarioAPI.Data;
using InventarioAPI.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using InventarioAPI.DTOs;

namespace InventarioApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocaisController : ControllerBase
    {
        private readonly InventarioDbContext _context;

        public LocaisController(InventarioDbContext context)
        {
            _context = context;
        }

        [HttpGet]        
        public async Task<ActionResult<IEnumerable<LocalListDto>>> GetLocais(
            [FromQuery] string nomeLocal = null,
            [FromQuery] string responsavelNome = null)
        {
            var query = _context.Locais
                .Include(l => l.Responsavel)
                .AsQueryable();

            if (!string.IsNullOrEmpty(nomeLocal))
            {
                query = query.Where(l => l.NomeLocal.Contains(nomeLocal));
            }
            if (!string.IsNullOrEmpty(responsavelNome))
            {
                query = query.Where(l => l.Responsavel != null && l.Responsavel.NomeCompleto.Contains(responsavelNome));
            }

            var locais = await query
                .Select(l => new LocalListDto
                {
                    Id = l.Id,
                    CodigoLocal = l.CodigoLocal,
                    NomeLocal = l.NomeLocal,
                    ResponsavelNomeCompleto = l.Responsavel != null ? l.Responsavel.NomeCompleto : null
                })
                .ToListAsync();
            return Ok(locais);
        }

        [HttpGet("meus-locais")]        
        public async Task<ActionResult<IEnumerable<LocalListDto>>> GetMeusLocais()
        {
            var userIdString = User.FindFirst("userId")?.Value;
            if (userIdString == null || !int.TryParse(userIdString, out int userId))
            {
                return Unauthorized();
            }
            
            var sessaoAtiva = await _context.SessoesConferencia
                                        .FirstOrDefaultAsync(s => s.Status == "ativa");
            
            var meusLocais = await _context.Locais
                .Where(l => l.ResponsavelId == userId)
                .Include(l => l.Responsavel)
                .Select(l => new LocalListDto
                {
                    Id = l.Id,
                    CodigoLocal = l.CodigoLocal,
                    NomeLocal = l.NomeLocal,
                    ResponsavelNomeCompleto = l.Responsavel.NomeCompleto,
                    TotalPatrimonios = _context.Patrimonios.Count(p => p.LocalId == l.Id),
                    ItensConferidos = sessaoAtiva != null ?
                                      _context.ItensConferidos.Count(i => i.SessaoId == sessaoAtiva.Id && i.LocalEncontradoId == l.Id) : 0,
                    TotalInconsistencias = sessaoAtiva != null ?
                                           _context.ItensConferidos.Count(i => i.SessaoId == sessaoAtiva.Id && i.LocalEncontradoId == l.Id && i.Status == "inconsistencia_local") : 0,
                    TotalJustificados = sessaoAtiva != null ? _context.ItensConferidos.Count(i => i.SessaoId == sessaoAtiva.Id && i.LocalEncontradoId == l.Id && i.Status == "justificado") : 0,
                    TotalItensForaPatrimonio = sessaoAtiva != null ? _context.ItensConferidos.Count(i => i.SessaoId == sessaoAtiva.Id && i.LocalEncontradoId == l.Id && i.Status == "item_nao_cadastrado") : 0

                })
                .ToListAsync();

            return Ok(meusLocais);
        }

        [HttpGet("{id}")]        
        public async Task<ActionResult<Local>> GetLocal(int id)
        {
            var local = await _context.Locais.FindAsync(id);
            if (local == null)
            {
                return NotFound();
            }
            return local;
        }

        [HttpPost]        
        public async Task<ActionResult<Local>> CreateLocal(LocalDto localDto)
        {
            var local = new Local
            {
                CodigoLocal = localDto.CodigoLocal,
                NomeLocal = localDto.NomeLocal,
                ResponsavelId = localDto.ResponsavelId
            };
            _context.Locais.Add(local);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetLocais), new { id = local.Id }, local);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLocal(int id, LocalDto localDto)
        {
            if (id != localDto.Id)
            {
                return BadRequest();
            }

            var local = await _context.Locais.FindAsync(id);
            if (local == null)
            {
                return NotFound();
            }

            local.CodigoLocal = localDto.CodigoLocal;
            local.NomeLocal = localDto.NomeLocal;
            local.ResponsavelId = localDto.ResponsavelId;

            _context.Entry(local).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LocalExists(id))
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
        public async Task<IActionResult> DeleteLocal(int id)
        {
            var local = await _context.Locais.FindAsync(id);
            if (local == null)
            {
                return NotFound();
            }

            _context.Locais.Remove(local);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LocalExists(int id)
        {
            return _context.Locais.Any(e => e.Id == id);
        }
    }
}