import { useState, useEffect } from 'react';
import { API_URL } from '../utils/Constantes';
import { APP_URL } from '../utils/Constantes';
import { API_IMG_URL } from '../utils/Constantes';
import { decodeToken } from '../utils/Auth';

function ItensConferidos() {
  const [itens, setItens] = useState([]);
  const [locais, setLocais] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState('');
  const [searchLocalId, setSearchLocalId] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  useEffect(() => {
    const fetchItens = async () => {
      const token = localStorage.getItem('token');
      const perfil = localStorage.getItem('perfil');
      
      if (!token) {
        setError("Token não encontrado. Faça login novamente.");
        setIsLoading(false);
        return;
      }
      
      setUserProfile(perfil);

      try {
        const payload = decodeToken(token);
        const userIdFromToken = payload?.userId;
        
        const queryParams = new URLSearchParams();
        if (searchLocalId) {
            queryParams.append('localId', searchLocalId);
        }
        if (searchStatus) {
            queryParams.append('status', searchStatus);
        }
        if (perfil === 'funcionario') {
            if (userIdFromToken) {
                queryParams.append('userId', userIdFromToken);
            }
        }

        const url = `${API_URL}/Admin/itens-conferidos?${queryParams.toString()}`;

        const response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        if (!response.ok) {
          throw new Error('Falha ao buscar os itens conferidos.');
        }
        const data = await response.json();
        setItens(data);
        console.log('Itens conferidos:', data);
        
        const locais = perfil == 'funcionario' ? `/Locais/meus-locais` : `/Locais`;
        
        const locaisResponse = await fetch(`${API_URL}${locais}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!locaisResponse.ok) {
          throw new Error('Falha ao buscar a lista de locais.');
        }
        const locaisData = await locaisResponse.json();
        setLocais(locaisData);

      } catch (err) {
        console.error('Erro ao buscar itens conferidos:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItens();
  }, [userProfile, searchLocalId, searchStatus]);

  if (isLoading) return <p>Carregando itens conferidos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Itens Conferidos</h2>

      {/*LEGENDA Card pode ser fechado*/}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Legenda:</h3>
        <div className="flex-row space-y-2 md:space-y-0 md:flex md:space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-200 rounded"></div>
            <span className="text-gray-700">Encontrado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-red-200 rounded"></div>
            <span className="text-gray-700">Inconsistência de Local</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-yellow-200 rounded"></div>
            <span className="text-gray-700">Item Não Cadastrado</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-blue-200 rounded"></div>
            <span className="text-gray-700">Justificado</span>
          </div>
        </div>
      </div>
      

      {/* Formulário de Busca */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <select
              value={searchLocalId}
              onChange={(e) => setSearchLocalId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Filtrar por Sala</option>
              {locais.map(local => (
                <option key={local.id} value={local.id}>{local.nomeLocal}</option>
              ))}
            </select>
            <select
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="">Filtrar por Status</option>
              <option value="encontrado">Encontrado</option>
              <option value="inconsistencia_local">Inconsistência de Local</option>
              <option value="item_nao_cadastrado">Item Não Cadastrado</option>
              <option value="justificado">Justificado</option>
            </select>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patrimônio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local Encontrado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local Esperado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Conferido por</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa OK</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {itens.map((item) => (
              <tr 
                key={item.id} 
                className={
                  item.status === 'inconsistencia_local'                    
                    ? 'bg-red-100'
                    : item.status === 'item_nao_cadastrado'
                    ? 'bg-yellow-100'
                    : item.status === 'encontrado'
                    ? 'bg-green-100'
                    : item.status === 'justificado'
                    ? 'bg-blue-100'
                    : ''
                }
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.numeroPatrimonio}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.patrimonioNome}
                  {item.observacao && <p className="text-gray-600 italic font-medium text-md">({item.observacao})</p>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.status === 'item_nao_cadastrado' ? 'Item Não Cadastrado' : (item.localEncontradoNome || 'N/A')}
                </td>                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.localEsperadoNome || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.conferidoPorNome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.placaIdentificacaoOk ? 'Sim' : 'Não'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.dataHoraConferencia).toLocaleString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">                  
                  {item.fotoUrl && <a href={`${API_IMG_URL}${item.fotoUrl}`} target="_blank" className="text-blue-500 hover:underline">
                    <img src={`${API_IMG_URL}${item.fotoUrl}`} alt="Foto do Item" className="h-10 w-10 object-cover rounded" />
                    </a>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ItensConferidos;