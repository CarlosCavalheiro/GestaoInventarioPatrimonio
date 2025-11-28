using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CsvHelper;
using CsvHelper.Configuration;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using InventarioApi.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using InventarioAPI.Data;
using InventarioAPI.DTOs;
using InventarioAPI.Models;

namespace InventarioAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly InventarioDbContext _context;

        public AdminController(InventarioDbContext context)
        {
            _context = context;
        }

        [HttpPost("import")]
        [Authorize(Roles = "administrador")]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> ImportarDados([FromForm] ImportRequestDto request)
        {
            if (request.Locais == null || request.Patrimonios == null)
            {
                return BadRequest("É necessário enviar os arquivos de locais e patrimônios.");
            }

            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                HasHeaderRecord = true,
                Delimiter = ";"
            };

            int locaisImportados = 0;
            int patrimoniosImportados = 0;
            int locaisIgnorados = 0;
            int patrimoniosIgnorados = 0;

            try
            {
                // Processar Locais
                using (var reader = new StreamReader(request.Locais.OpenReadStream(), Encoding.UTF8))
                using (var csv = new CsvReader(reader, config))
                {
                    var records = csv.GetRecords<LocalCsvDto>().ToList();
                    foreach (var record in records)
                    {
                        if (string.IsNullOrEmpty(record.CodLocal))
                        {
                            locaisIgnorados++;
                            continue;
                        }

                        var responsavel = await _context.Usuarios
                            .FirstOrDefaultAsync(u => u.NomeCompleto == record.Responsavel);

                        var localExistente = await _context.Locais
                            .FirstOrDefaultAsync(l => l.CodigoLocal == record.CodLocal);

                        if (localExistente == null)
                        {
                            _context.Locais.Add(new Local
                            {
                                CodigoLocal = record.CodLocal,
                                NomeLocal = record.NomeLocal,
                                ResponsavelId = responsavel?.Id
                            });
                        }
                        else
                        {
                            localExistente.NomeLocal = record.NomeLocal;
                            localExistente.ResponsavelId = responsavel?.Id;
                        }
                        locaisImportados++;
                    }
                    await _context.SaveChangesAsync();
                }

                // Processar Patrimônios
                using (var reader = new StreamReader(request.Patrimonios.OpenReadStream(), Encoding.UTF8))
                using (var csv = new CsvReader(reader, config))
                {
                    var records = csv.GetRecords<PatrimonioCsvDto>().ToList();
                    foreach (var record in records)
                    {
                        if (string.IsNullOrEmpty(record.NI))
                        {
                            patrimoniosIgnorados++;
                            continue;
                        }

                        var patrimonioExistente = await _context.Patrimonios.FirstOrDefaultAsync(p => p.NumeroPatrimonio == record.NI);
                        var local = await _context.Locais.FirstOrDefaultAsync(l => l.CodigoLocal == record.CodLocal);

                        if (patrimonioExistente == null)
                        {
                            _context.Patrimonios.Add(new Patrimonio { NumeroPatrimonio = record.NI, DescricaoEquipamento = record.NomeEquipamento, Local = local });
                        }
                        else
                        {
                            patrimonioExistente.DescricaoEquipamento = record.NomeEquipamento;
                            patrimonioExistente.Local = local;
                        }
                        patrimoniosImportados++;
                    }
                    await _context.SaveChangesAsync();
                }

                return Ok(new ImportResponseDto
                {
                    LocaisImportados = locaisImportados,
                    PatrimoniosImportados = patrimoniosImportados,
                    LocaisIgnorados = locaisIgnorados,
                    PatrimoniosIgnorados = patrimoniosIgnorados
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro na importação: {ex.Message}");
            }
        }

        [HttpGet("relatorio/{sessaoId}")]
        [Authorize(Roles = "administrador")]
        public async Task<ActionResult<RelatorioInconsistenciasDto>> GerarRelatorioInconsistencias(int sessaoId)
        {
            var totalPatrimonios = await _context.Patrimonios.CountAsync();

            var patrimoniosEncontrados = await _context.ItensConferidos
                .Where(i => i.SessaoId == sessaoId)
                .Select(i => i.PatrimonioId)         
                .ToListAsync();

            var totalEncontrados = patrimoniosEncontrados.Count;

            // Busca os detalhes dos patrimônios não encontrados
            var patrimoniosNaoEncontrados = await _context.Patrimonios
                .Where(p => !patrimoniosEncontrados.Contains(p.Id))
                .Include(p => p.Local)
                .Select(p => new PatrimonioNaoEncontradoDto
                {
                    NumeroPatrimonio = p.NumeroPatrimonio,
                    DescricaoEquipamento = p.DescricaoEquipamento,
                    LocalEsperado = p.Local.NomeLocal
                })
                .OrderBy(x => x.NumeroPatrimonio)
                .ToListAsync();

            var inconsistenciasLocal = await _context.ItensConferidos
                .Where(i => i.SessaoId == sessaoId && i.Patrimonio.LocalId != i.LocalEncontradoId)
                .Include(i => i.Patrimonio)
                .Include(i => i.Patrimonio.Local)
                .Include(i => i.LocalEncontrado)
                .Select(i => new InconsistenciaLocalItemDto
                {
                    NumeroPatrimonio = i.Patrimonio.NumeroPatrimonio != null ? i.Patrimonio.NumeroPatrimonio : "SEM NI",
                    LocalEsperado = i.Patrimonio.Local.NomeLocal,
                    LocalEncontrado = i.LocalEncontrado.NomeLocal
                })
                .OrderBy(x => x.NumeroPatrimonio)
                .ToListAsync();

            var totalItensForaPatrimonio = await _context.ItensConferidos.CountAsync(i => i.SessaoId == sessaoId && i.Status == "item_nao_cadastrado");

            var relatorio = new RelatorioInconsistenciasDto
            {
                SessaoId = sessaoId,
                TotalPatrimoniosEsperados = totalPatrimonios,
                TotalPatrimoniosEncontrados = totalEncontrados,
                TotalPatrimoniosNaoEncontrados = patrimoniosNaoEncontrados.Count,
                TotalItensForaPatrimonio = totalItensForaPatrimonio,
                TotalInconsistenciasLocal = inconsistenciasLocal.Count,
                PatrimoniosNaoEncontrados = patrimoniosNaoEncontrados,
                InconsistenciasLocal = inconsistenciasLocal
            };

            return Ok(relatorio);
        }

        [HttpGet("summary")]
        [Authorize(Roles = "administrador")]
        public async Task<ActionResult<DashboardSummaryDto>> GetDashboardSummary()
        {
            var ultimaSessao = await _context.SessoesConferencia
                .OrderByDescending(s => s.DataInicio)
                .Where(s => s.Status == "ativa")
                .FirstOrDefaultAsync();

            var totalInconsistencias = 0;
            
            if (ultimaSessao != null)
            {
                totalInconsistencias = await _context.ItensConferidos
                    .CountAsync(i => i.SessaoId == ultimaSessao.Id && i.Status == "inconsistencia_local");
            }

            var summary = new DashboardSummaryDto
            {
                TotalPatrimonios = await _context.Patrimonios.CountAsync(),
                TotalLocais = await _context.Locais.CountAsync(),
                TotalResponsaveis = await _context.Locais.Where(l => l.ResponsavelId.HasValue).Select(l => l.ResponsavelId).Distinct().CountAsync(),
                TotalItensConferidos = await _context.ItensConferidos.CountAsync(),
                TotalInconsistencias = totalInconsistencias,
                TotalItensForaPatrimonio = await _context.ItensConferidos.CountAsync(i => i.SessaoId == ultimaSessao.Id && i.Status == "item_nao_cadastrado")
            };

            return Ok(summary);
        }

        [HttpGet("dashboard-conferencias")]
        [Authorize(Roles = "administrador")]
        public async Task<ActionResult<IEnumerable<DashboardConferenciasDto>>> GetDashboardConferencias()
        {
            var sessaoAtiva = await _context.SessoesConferencia
                .FirstOrDefaultAsync(s => s.Status == "ativa");

            if (sessaoAtiva == null)
            {
                return Ok(new List<DashboardConferenciasDto>());
            }

            //var totalPatrimonios = await _context.Patrimonios.CountAsync();

            var dadosDashboard = await _context.Locais
                .Include(l => l.Responsavel)
                .Select(g => new DashboardConferenciasDto
                {
                    LocalId = g.Id,
                    NomeLocal = g.NomeLocal,
                    NomeCompleto = g.Responsavel.NomeCompleto,
                    TotalItens = _context.Patrimonios.Where(p => p.LocalId == g.Id).Count(),
                    TotalItensConferidos = _context.ItensConferidos.Count(i => i.SessaoId == sessaoAtiva.Id && i.LocalEncontradoId == g.Id),
                    TotalInconsistencias = _context.ItensConferidos.Count(i => i.SessaoId == sessaoAtiva.Id && i.LocalEncontradoId == g.Id && (i.Status == "inconsistencia_local" || i.Status == "item_nao_cadastrado")),
                    TotalJustificados = _context.ItensConferidos.Count(i => i.SessaoId == sessaoAtiva.Id && i.LocalEncontradoId == g.Id && i.Status == "justificado"),
                    TotalItensForaPatrimonio = _context.ItensConferidos.Count(i => i.SessaoId == sessaoAtiva.Id && i.LocalEncontradoId == g.Id && i.Status == "item_nao_cadastrado"),
                    
                })                
                .OrderBy(x => x.NomeCompleto)
                .ToListAsync();

            return Ok(dadosDashboard);
        }

        [HttpGet("itens-conferidos")]
        public async Task<ActionResult<IEnumerable<ItemConferidoResponseDto>>> GetItensConferidos(
            [FromQuery] int? sessaoId = null,
            [FromQuery] int? localId = null,
            [FromQuery] string status = null) 
        {
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            var userIdString = User.FindFirst("userId")?.Value;
            int userId = int.TryParse(userIdString, out int id) ? id : 0;

            var query = _context.ItensConferidos
                .Include(i => i.LocalEncontrado)
                .Include(i => i.Patrimonio).ThenInclude(p => p.Local)
                .Include(i => i.ConferidoPor)
                .Include(i => i.SessaoConferencia)
                .OrderBy(x => x.PatrimonioId)
                .AsQueryable();

            if (userRole == "administrador")
            {
                if (sessaoId.HasValue)
                {
                    query = query.Where(i => i.SessaoId == sessaoId.Value);
                }
            }
            else if (userRole == "funcionario")
            {
                query = query.Where(i => i.ConferidoPorId == userId);
            }
            
            // Adicionar os novos filtros
            if (localId.HasValue)
            {
                query = query.Where(i => i.LocalEncontradoId == localId.Value);
            }
            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(i => i.Status == status);
            }

            var itensConferidos = await query
                .Select(i => new ItemConferidoResponseDto
                {
                    Id = i.Id,
                    SessaoId = i.SessaoId,
                    NumeroPatrimonio = i.IdentificacaoNI == null ? "SEM PATRIMONIO" : i.IdentificacaoNI,
                    PatrimonioNome = i.PatrimonioNome == null ? "SEM CADASTRO" : i.PatrimonioNome,
                    LocalEncontradoId = i.LocalEncontradoId,
                    LocalEncontradoNome = i.LocalEncontrado.NomeLocal,
                    LocalEsperadoNome = i.Patrimonio.Local.NomeLocal == null ? "SEM CADASTRO" : i.Patrimonio.Local.NomeLocal,
                    PlacaIdentificacaoOk = i.PlacaIdentificacaoOk,
                    Observacao = i.Observacao == null ? "" : i.Observacao,
                    FotoUrl = i.FotoUrl,
                    Status = i.Status,
                    LeituraTipo = i.LeituraTipo,
                    DataHoraConferencia = i.DataHoraConferencia,
                    ConferidoPorId = i.ConferidoPorId,
                    ConferidoPorNome = i.ConferidoPor != null ? i.ConferidoPor.NomeCompleto : "Desconhecido"

                })
                .OrderBy(x => x.NumeroPatrimonio)
                .ToListAsync();

            return Ok(itensConferidos);
        }

    }
}