import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/Constantes';

function ImportData() {
  const [locaisFile, setLocaisFile] = useState(null);
  const [patrimoniosFile, setPatrimoniosFile] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleImport = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (!locaisFile || !patrimoniosFile) {
      setMessage('Por favor, selecione ambos os arquivos.');
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('locais', locaisFile);
    formData.append('patrimonios', patrimoniosFile);

    try {
      const response = await fetch(API_URL + '/Admin/import', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Falha na importação. Verifique o console para mais detalhes.');
      }

      const data = await response.json();
      setMessage(`Importação concluída com sucesso! Locais: ${data.locaisImportados}, Patrimônios: ${data.patrimoniosImportados}`);
    } catch (error) {
      console.error('Erro na importação:', error);
      setMessage(`Erro: ${error.message}`);
    } finally {
      setIsLoading(false);
      // Limpa os arquivos selecionados
      setLocaisFile(null);
      setPatrimoniosFile(null);
      document.getElementById('locaisFile').value = null;
      document.getElementById('patrimoniosFile').value = null;
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Importar Dados</h2>
      <form onSubmit={handleImport} className="bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="locaisFile">
            Arquivo de Locais (.csv)
          </label>
          <input
            id="locaisFile"
            type="file"
            accept=".csv"
            onChange={(e) => setLocaisFile(e.target.files[0])}
            className="w-full px-3 py-2 border rounded-lg text-gray-700"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="patrimoniosFile">
            Arquivo de Patrimônios (.csv)
          </label>
          <input
            id="patrimoniosFile"
            type="file"
            accept=".csv"
            onChange={(e) => setPatrimoniosFile(e.target.files[0])}
            className="w-full px-3 py-2 border rounded-lg text-gray-700"
          />
        </div>
        {message && (
          <div className={`p-4 rounded mb-4 ${message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          disabled={isLoading}
        >
          {isLoading ? 'Importando...' : 'Importar'}
        </button>
      </form>
    </div>
  );
}

export default ImportData;