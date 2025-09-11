using System.Text;
using InventarioApi.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.EntityFrameworkCore;
using InventarioApi.Services;


var builder = WebApplication.CreateBuilder(args);

//Conexão com o banco de dados MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<InventarioDbContext>(options =>
    options.UseMySQL(connectionString));

// Serviços
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSingleton<AzureBlobService>();

// Configuração do Swagger para Autenticação JWT
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "API Gestão de Inventário", Version = "v1" });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder => builder.AllowAnyOrigin()
                          .AllowAnyMethod()
                          .AllowAnyHeader());
});

var app = builder.Build();

app.UseHttpsRedirection();
app.UseCors("AllowAllOrigins");

// Pipeline
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("./swagger/v1/swagger.json", "API Gestão de Inventário");
        options.RoutePrefix = string.Empty;        
    });
}

app.MapControllers();

app.Run();
