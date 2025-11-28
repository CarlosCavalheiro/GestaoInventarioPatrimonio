using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using InventarioApi.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Linq;
using InventarioAPI.Data;
using InventarioAPI.DTOs;
using InventarioAPI.Models;
using InventarioAPI.Services;

namespace InventarioAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ItensConferidosController : ControllerBase
    {
        private readonly InventarioDbContext _context;
        private readonly LocalFileService _fileService;


        public ItensConferidosController(InventarioDbContext context, LocalFileService fileService)
        {
            _context = context;
            _fileService = fileService;

        }

        [HttpPost]
        public async Task<IActionResult> ConferirItem([FromForm] InventarioItemRequest request)
        {
            string fotoUrl = null;

            if (request.foto != null && request.foto.Length > 0)
            {
                fotoUrl = await _fileService.UploadFileAsync(request.foto);
            }

            // Buscar o patrimônio e seu local esperado
            var patrimonio = await _context.Patrimonios
                                .Include(p => p.Local)
                                .FirstOrDefaultAsync(p => p.NumeroPatrimonio == request.numeroPatrimonio);

            var userIdString = User.FindFirst("userId")?.Value;
            int? conferidoPorId = null;
            if (int.TryParse(userIdString, out int id))
            {
                conferidoPorId = id;
            }

            // Lógica para definir o status
            string status;
            if (patrimonio == null)
            {
                status = "item_nao_cadastrado";
            }
            else if (patrimonio.LocalId != request.localEncontradoId)
            {
                status = "inconsistencia_local";
            }
            else
            {
                status = "encontrado";
            }

            // Definição dos valores condicionais
            int? patrimonioId = null;
            string patrimonioNome = "Item Não Cadastrado";

            if (patrimonio != null)
            {
                patrimonioId = patrimonio.Id;
                patrimonioNome = patrimonio.DescricaoEquipamento ?? "Sem Descrição";
            }

            var itemConferido = new ItemConferido
            {
                SessaoId = request.sessaoId,
                PatrimonioId = patrimonioId,
                IdentificacaoNI = request.numeroPatrimonio,
                PatrimonioNome = patrimonioNome,
                LocalEncontradoId = request.localEncontradoId,
                Status = status,
                LeituraTipo = request.foto != null ? "camera" : "manual",
                PlacaIdentificacaoOk = request.placaIdentificacaoOk,
                Observacao = request.observacao,
                FotoUrl = fotoUrl,
                DataHoraConferencia = DateTime.Now,
                ConferidoPorId = conferidoPorId
            };

            _context.ItensConferidos.Add(itemConferido);
            await _context.SaveChangesAsync();

            var responseDto = new ItemConferidoResponseDto
            {
                Id = itemConferido.Id,
                SessaoId = itemConferido.SessaoId,
                NumeroPatrimonio = itemConferido.IdentificacaoNI,
                PatrimonioNome = itemConferido.PatrimonioNome,
                LocalEncontradoId = itemConferido.LocalEncontradoId,
                PlacaIdentificacaoOk = itemConferido.PlacaIdentificacaoOk,
                Observacao = itemConferido.Observacao,
                FotoUrl = itemConferido.FotoUrl,
                Status = itemConferido.Status,
                LeituraTipo = itemConferido.LeituraTipo,
                DataHoraConferencia = itemConferido.DataHoraConferencia
            };

            return Ok(responseDto);
        }

        [HttpGet("conferidos")]
        public async Task<ActionResult<IEnumerable<ItemConferidoResponseDto>>> GetItensConferidos(
            [FromQuery] int sessaoId,
            [FromQuery] int localId)
        {
            var itens = await _context.ItensConferidos
                .Where(i => i.SessaoId == sessaoId && i.LocalEncontradoId == localId)
                .Include(i => i.LocalEncontrado)
                .Select(i => new ItemConferidoResponseDto
                {
                    Id = i.Id,
                    SessaoId = i.SessaoId,
                    NumeroPatrimonio = i.IdentificacaoNI,
                    PatrimonioNome = i.PatrimonioNome == null ? "Sem Descrição" : i.PatrimonioNome,
                    LocalEncontradoId = i.LocalEncontradoId,
                    LocalEncontradoNome = i.LocalEncontrado.NomeLocal,
                    PlacaIdentificacaoOk = i.PlacaIdentificacaoOk,
                    Observacao = i.Observacao == null ? "" : i.Observacao,
                    FotoUrl = i.FotoUrl,
                    Status = i.Status,
                    LeituraTipo = i.LeituraTipo,
                    DataHoraConferencia = i.DataHoraConferencia
                })
                .ToListAsync();

            return Ok(itens);
        }

        [HttpGet("inconsistencias")]
        public async Task<ActionResult<IEnumerable<InconsistenciaLocalItemDto>>> GetInconsistencias(
             [FromQuery] int sessaoId,
             [FromQuery] int localId)
        {
            var inconsistencias = await _context.ItensConferidos
                // Filtra primeiro para pegar apenas os itens com patrimônio associado
                .Where(i => i.Patrimonio != null)
                // Em seguida, aplica os demais filtros com segurança
                .Where(i => i.SessaoId == sessaoId && i.LocalEncontradoId == localId && i.Patrimonio.LocalId != i.LocalEncontradoId)
                .Include(i => i.Patrimonio)
                .Include(i => i.Patrimonio.Local)
                .Include(i => i.LocalEncontrado)
                .Select(i => new InconsistenciaLocalItemDto
                {
                    NumeroPatrimonio = i.IdentificacaoNI,
                    PatrimonioNome = i.PatrimonioNome,
                    LocalEsperado = i.Patrimonio.Local.NomeLocal == null ? "SEM CADASTRO NA BASE" : i.Patrimonio.Local.NomeLocal,
                    LocalEncontrado = i.LocalEncontrado.NomeLocal
                })
                .ToListAsync();

            return Ok(inconsistencias);
        }

        [HttpGet("inconsistencias-meu-local")]
        public async Task<ActionResult<IEnumerable<InconsistenciaLocalItemDto>>> GetInconsistenciasMeuLocal(
             [FromQuery] int sessaoId,
             [FromQuery] int localId)
        {
            var userIdString = User.FindFirst("userId")?.Value;

            var inconsistencias = await _context.ItensConferidos
                // Filtra primeiro para pegar apenas os itens com patrimônio associado
                .Where(i => i.Patrimonio != null)
                // Em seguida, aplica os demais filtros com segurança
                .Where(i => i.SessaoId == sessaoId && i.Patrimonio.LocalId == localId && i.LocalEncontradoId != localId)
                .Include(i => i.Patrimonio)
                .Include(i => i.ConferidoPor)
                .Include(i => i.Patrimonio.Local)
                .Include(i => i.LocalEncontrado)
                .Select(i => new InconsistenciaMeuLocalItemDto
                {
                    NumeroPatrimonio = i.IdentificacaoNI,
                    PatrimonioNome = i.PatrimonioNome,
                    LocalEsperado = i.Patrimonio.Local.NomeLocal == null ? "SEM CADASTRO NA BASE" : i.Patrimonio.Local.NomeLocal,
                    LocalEncontrado = i.LocalEncontrado.NomeLocal,
                    ConferidoPorId = i.ConferidoPor.Id,
                    ConferidoPorNome = i.ConferidoPor.NomeCompleto
                })
                .ToListAsync();

            return Ok(inconsistencias);
        }

        [HttpGet("count-by-local")]
        public async Task<ActionResult<int>> GetConferidosCountByLocal(
            [FromQuery] int sessaoId,
            [FromQuery] int localId)
        {
            var count = await _context.ItensConferidos
                .CountAsync(i => i.SessaoId == sessaoId && i.LocalEncontradoId == localId);
            return Ok(count);
        }
        
        [HttpPost("justificar")]
        public async Task<IActionResult> JustificarItem([FromBody] JustifyItemDto request)
        {            
            // Buscar o patrimônio e seu local esperado
            var patrimonio = await _context.Patrimonios
                                .Include(p => p.Local)
                                .FirstOrDefaultAsync(p => p.NumeroPatrimonio == request.NumeroPatrimonio);
            
            // Definição dos valores condicionais
            int? patrimonioId = null;
            string patrimonioNome = "Item Não Cadastrado";

            if (patrimonio != null)
            {
                patrimonioId = patrimonio.Id;
                patrimonioNome = patrimonio.DescricaoEquipamento ?? "Sem Descrição";
            }

            var userIdString = User.FindFirst("userId")?.Value;
            int? conferidoPorId = null;
            if (int.TryParse(userIdString, out int id))
            {
                conferidoPorId = id;
            }

            var itemConferido = new ItemConferido
            {                                                                                

                SessaoId = request.SessaoId,
                PatrimonioId = patrimonioId,
                IdentificacaoNI = request.NumeroPatrimonio,
                PatrimonioNome = patrimonioNome,
                LocalEncontradoId = request.LocalEncontradoId,                
                ConferidoPorId = conferidoPorId,
                Status = "justificado",
                LeituraTipo = "manual",
                PlacaIdentificacaoOk = false,
                Observacao = request.Justificativa,
                FotoUrl = "sem_foto.jpg",
                DataHoraConferencia = DateTime.Now
            };

            _context.ItensConferidos.Add(itemConferido);
            await _context.SaveChangesAsync();

            var responseDto = new ItemConferidoResponseDto
            {
                Id = itemConferido.Id,
                SessaoId = itemConferido.SessaoId,
                NumeroPatrimonio = itemConferido.IdentificacaoNI,
                PatrimonioNome = itemConferido.PatrimonioNome,
                LocalEncontradoId = itemConferido.LocalEncontradoId,
                PlacaIdentificacaoOk = itemConferido.PlacaIdentificacaoOk,
                Observacao = itemConferido.Observacao,
                FotoUrl = itemConferido.FotoUrl,
                Status = itemConferido.Status,
                LeituraTipo = itemConferido.LeituraTipo,
                DataHoraConferencia = itemConferido.DataHoraConferencia
            };

            return Ok(responseDto);
        }

        // Endpoint para download/visualização de fotos
        [HttpGet("foto/{fileName}")]
        [AllowAnonymous] // Permite acesso sem autenticação - remova se quiser restringir
        public IActionResult GetFoto(string fileName)
        {
            var filePath = Path.Combine(_fileService.GetUploadPath(), fileName);
            
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound(new { message = "Foto não encontrada" });
            }

            var fileBytes = System.IO.File.ReadAllBytes(filePath);
            var contentType = "image/jpeg"; // Ajuste conforme o tipo de imagem
            
            // Detectar tipo de arquivo pela extensão
            var extension = Path.GetExtension(fileName).ToLower();
            contentType = extension switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                ".bmp" => "image/bmp",
                _ => "application/octet-stream"
            };

            return File(fileBytes, contentType);
        }
    }
}