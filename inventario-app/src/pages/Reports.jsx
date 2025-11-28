import { useState } from 'react';
import { API_URL } from '../utils/Constantes';

function Reports() {
  const [sessionId, setSessionId] = useState('');
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    if (!sessionId) {
      setError('Por favor, insira um ID de sessão.');
      return;
    }

    setIsLoading(true);
    setError('');
    setReportData(null);

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/Admin/relatorio/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Falha ao buscar o relatório. Verifique o ID da sessão.');
      }

      const data = await response.json();
      setReportData(data);
    } catch (err) {
      console.error('Erro ao buscar o relatório:', err);
      setError(`Erro: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Relatório de Inconsistências</h2>
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <label className="block text-gray-700 font-bold mb-2">ID da Sessão:</label>
        <div className="flex space-x-2">
          <input
            type="number"
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            placeholder="Ex: 1"
            className="w-full px-3 py-2 border rounded-lg text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchReport}
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
          >
            {isLoading ? 'Gerando...' : 'Gerar Relatório'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {reportData && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-bold mb-4">Resumo da Sessão {reportData.sessaoId}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
            <div className="bg-blue-100 p-4 rounded-lg">
              <p className="text-2xl font-bold">{reportData.totalPatrimoniosEsperados}</p>
              <p className="text-sm text-gray-600">Patrimônios Esperados</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <p className="text-2xl font-bold">{reportData.totalPatrimoniosEncontrados}</p>
              <p className="text-sm text-gray-600">Patrimônios Encontrados</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <p className="text-2xl font-bold">{reportData.totalPatrimoniosNaoEncontrados}</p>
              <p className="text-sm text-gray-600">Patrimônios Não Encontrados</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <p className="text-2xl font-bold">{reportData.totalInconsistenciasLocal}</p>
              <p className="text-sm text-gray-600">Inconsistências de Local</p>
            </div>
          </div>

          <h3 className="text-lg font-bold mb-2">Patrimônios Não Encontrados</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            {reportData.patrimoniosNaoEncontrados.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {reportData.patrimoniosNaoEncontrados.map((item, index) => (
                  <li key={index}>
                    <span className="font-semibold">{item.numeroPatrimonio}</span> - {item.descricaoEquipamento} (Local Esperado: {item.localEsperado})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Nenhum patrimônio não encontrado.</p>
            )}
          </div>
          
          <h3 className="text-lg font-bold mb-2 mt-6">Itens em Locais Incorretos</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            {reportData.inconsistenciasLocal.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {reportData.inconsistenciasLocal.map((item, index) => (
                  <li key={index}>
                    <span className="font-semibold">{item.numeroPatrimonio}:</span> 
                    {' '}Encontrado em **{item.localEncontrado}** (Esperado: {item.localEsperado})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Nenhum item em local incorreto.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Reports;