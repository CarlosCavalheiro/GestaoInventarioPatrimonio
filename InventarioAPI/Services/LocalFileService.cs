namespace InventarioAPI.Services
{
    public class LocalFileService
    {
        private readonly string _uploadPath;
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;

        public LocalFileService(IWebHostEnvironment environment, IConfiguration configuration)
        {
            _environment = environment;
            _configuration = configuration;
            
            // Define o diretório de uploads na raiz do backend
            _uploadPath = Path.Combine(_environment.ContentRootPath, "uploads");
            
            // Cria o diretório se não existir
            if (!Directory.Exists(_uploadPath))
            {
                Directory.CreateDirectory(_uploadPath);
            }
        }

        public async Task<string?> UploadFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return null;
            }

            // Gera um nome único para o arquivo
            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(_uploadPath, fileName);

            // Salva o arquivo no diretório
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Retorna a URL relativa para acessar o arquivo
            // O arquivo será acessível via /uploads/{fileName}
            return $"/uploads/{fileName}";
        }

        public bool DeleteFile(string fileName)
        {
            try
            {
                var filePath = Path.Combine(_uploadPath, fileName);
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                    return true;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        public string GetUploadPath()
        {
            return _uploadPath;
        }
    }
}
