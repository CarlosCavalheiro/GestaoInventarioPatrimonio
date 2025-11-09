using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Linq;
using InventarioApi.DTOs;
using System.Security.Claims;
using InventarioAPI.Data;
using InventarioAPI.Models;

namespace InventarioApi.Controllers
{    
    [Route("api/[controller]")]
    [ApiController]
    public class PatrimoniosController : ControllerBase
    {
        private readonly InventarioDbContext _context;

        public PatrimoniosController(InventarioDbContext context)
        {
            _context = context;
        }

        [HttpGet]        
        public async Task<ActionResult<IEnumerable<PatrimonioListDto>>> GetPatrimonios(
            [FromQuery] string numeroPatrimonio = null,
            [FromQuery] string localNome = null,
            [FromQuery] int? localId = null)
        {
            var query = _context.Patrimonios
                .Include(p => p.Local)
                .AsQueryable();

            if (!string.IsNullOrEmpty(numeroPatrimonio))
            {
                query = query.Where(p => p.NumeroPatrimonio.Contains(numeroPatrimonio));
            }
            if (!string.IsNullOrEmpty(localNome))
            {
                query = query.Where(p => p.Local.NomeLocal.Contains(localNome));
            }
            if (localId.HasValue)
            {
                query = query.Where(p => p.LocalId == localId.Value);
            }

            var patrimonios = await query
                .Select(p => new PatrimonioListDto
                {
                    Id = p.Id,
                    NumeroPatrimonio = p.NumeroPatrimonio,
                    DescricaoEquipamento = p.DescricaoEquipamento,
                    LocalId = p.LocalId,
                    LocalNome = p.Local.NomeLocal
                })
                .OrderBy(x => x.NumeroPatrimonio)
                .ToListAsync();
            return Ok(patrimonios);
        }

        [HttpGet("meus-patrimonios")]        
        public async Task<ActionResult<IEnumerable<PatrimonioListDto>>> GetMeusPatrimonios(
            [FromQuery] int localId)
        {
            var patrimonios = await _context.Patrimonios
                .Where(p => p.LocalId == localId)
                .Select(p => new PatrimonioListDto
                {
                    Id = p.Id,
                    NumeroPatrimonio = p.NumeroPatrimonio,
                    DescricaoEquipamento = p.DescricaoEquipamento,
                    LocalId = p.LocalId,
                    LocalNome = p.Local.NomeLocal
                })
                .OrderBy(x => x.NumeroPatrimonio)
                .ToListAsync();

            return Ok(patrimonios);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Patrimonio>> GetPatrimonio(int id)
        {
            var patrimonio = await _context.Patrimonios.FindAsync(id);
            if (patrimonio == null)
            {
                return NotFound();
            }
            return patrimonio;
        }

        [HttpPost]        
        public async Task<ActionResult<Patrimonio>> CreatePatrimonio(PatrimonioDto patrimonioDto)
        {
            var patrimonio = new Patrimonio
            {
                NumeroPatrimonio = patrimonioDto.NumeroPatrimonio,
                DescricaoEquipamento = patrimonioDto.DescricaoEquipamento,
                LocalId = patrimonioDto.LocalId
            };
            _context.Patrimonios.Add(patrimonio);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPatrimonios), new { id = patrimonio.Id }, patrimonio);
        }

        [HttpPut("{id}")]        
        public async Task<IActionResult> UpdatePatrimonio(int id, PatrimonioDto patrimonioDto)
        {
            if (id != patrimonioDto.Id)
            {
                return BadRequest();
            }

            var patrimonio = await _context.Patrimonios.FindAsync(id);
            if (patrimonio == null)
            {
                return NotFound();
            }

            patrimonio.NumeroPatrimonio = patrimonioDto.NumeroPatrimonio;
            patrimonio.DescricaoEquipamento = patrimonioDto.DescricaoEquipamento;
            patrimonio.LocalId = patrimonioDto.LocalId;

            _context.Entry(patrimonio).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatrimonioExists(id))
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
        public async Task<IActionResult> DeletePatrimonio(int id)
        {
            var patrimonio = await _context.Patrimonios.FindAsync(id);
            if (patrimonio == null)
            {
                return NotFound();
            }

            _context.Patrimonios.Remove(patrimonio);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PatrimonioExists(int id)
        {
            return _context.Patrimonios.Any(e => e.Id == id);
        }
        

        [HttpGet("count-by-local/{localId}")]
        public async Task<ActionResult<int>> GetPatrimoniosCountByLocal(int localId)
        {
            var count = await _context.Patrimonios.CountAsync(p => p.LocalId == localId);
            return Ok(count);
        }
    }
}