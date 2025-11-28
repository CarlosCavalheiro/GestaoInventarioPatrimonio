import { useState, useEffect } from 'react';
import { API_URL } from '../utils/Constantes';

function Sessoes() {
  const [sessoes, setSessoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(1);

  useEffect(() => {
    fetchSessoes();
  }, []);

  const fetchSessoes = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token não encontrado. Faça login novamente.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/SessoesConferencia`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('Falha ao buscar as sessões.');
      }
      const data = await response.json();
      setSessoes(data);
    } catch (err) {
      console.error('Erro ao buscar as sessões:', err);
      setError('Falha ao carregar as sessões. Verifique a conexão com a API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIniciarSessao = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token não encontrado. Faça login novamente.');
      return;
    }

    // Validação básica do userId
    if (!userId) {
      setError('ID do usuário é obrigatório para iniciar a sessão.');
      return;
    }

    if (!window.confirm('Tem certeza que deseja iniciar uma nova sessão de conferência?')) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/SessoesConferencia/iniciar?userId=${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Falha ao iniciar a nova sessão.');
      }
      // Re-busca a lista de sessões para atualizar a tabela
      fetchSessoes();
    } catch (err) {
      console.error('Erro ao iniciar sessão:', err);
      setError(err.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Sessões de Conferência</h2>
      {isLoading && <p>Carregando sessões...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="flex justify-end mb-4">
        <button onClick={handleIniciarSessao} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Iniciar Nova Sessão
        </button>
      </div>

      {!isLoading && !error && (
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Iniciada Em</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Finalizada Em</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sessoes.map((sessao) => (
                <tr key={sessao.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sessao.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(sessao.dataInicio).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sessao.dataFim ? new Date(sessao.dataFim).toLocaleString() : 'Em andamento'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sessao.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Sessoes;