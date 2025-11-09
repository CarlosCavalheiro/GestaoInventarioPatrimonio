import { useState, useEffect } from 'react';
import { API_URL } from '../utils/Constantes';
import Modal from '../components/Modal';
import PatrimonioForm from '../components/PatrimonioForm';

function Patrimonios() {
  const [patrimonios, setPatrimonios] = useState([]);
  const [locais, setLocais] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ id: 0, numeroPatrimonio: '', descricaoEquipamento: '', localId: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchNumeroPatrimonio, setSearchNumeroPatrimonio] = useState('');
  const [searchLocalNome, setSearchLocalNome] = useState('');

  useEffect(() => {
    fetchData();
  }, [searchNumeroPatrimonio, searchLocalNome]);

  const fetchData = async () => {
    const token = localStorage.getItem('token');

    // if (!token) {
    //   setError('Token não encontrado. Faça login novamente.');
    //   setIsLoading(false);
    //   return;
    // }

    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (searchNumeroPatrimonio) {
        queryParams.append('numeroPatrimonio', searchNumeroPatrimonio);
      }
      if (searchLocalNome) {
        queryParams.append('localNome', searchLocalNome);
      }
      const queryString = queryParams.toString();

      const url = `${API_URL}/Patrimonios${queryString ? `?${queryString}` : ''}`;

      console.log("URL:", url);
      
      const patrimoniosResponse = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!patrimoniosResponse.ok) {
        throw new Error('Falha ao buscar patrimônios.');
      }
      const patrimoniosData = await patrimoniosResponse.json();
      setPatrimonios(patrimoniosData);

      const locaisResponse = await fetch(`${API_URL}/Locais`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const locaisData = await locaisResponse.json();
      setLocais(locaisData);
      
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Falha ao carregar os dados. Verifique a conexão com a API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    setFormData({ id: 0, numeroPatrimonio: '', descricaoEquipamento: '', localId: null });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (patrimonio) => {
    setFormData({ id: patrimonio.id, numeroPatrimonio: patrimonio.numeroPatrimonio, descricaoEquipamento: patrimonio.descricaoEquipamento, localId: patrimonio.localId });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const method = isEditing ? 'PUT' : 'POST';
    const url = `${API_URL}/Patrimonios/${isEditing ? formData.id : ''}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar o patrimônio.');
      }

      closeModal();
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Tem certeza que deseja excluir este patrimônio?')) {
      try {
        const response = await fetch(`${API_URL}/Patrimonios/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Falha ao excluir o patrimônio.');
        }

        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Gerenciar Patrimônios</h2>
      {isLoading && <p>Carregando lista de patrimônios...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Formulário de Busca */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            value={searchNumeroPatrimonio}
            onChange={(e) => setSearchNumeroPatrimonio(e.target.value)}
            placeholder="Filtrar por Número do Patrimônio"
            className="w-full px-3 py-2 border rounded-lg"
          />
          <select
            value={searchLocalNome}
            onChange={(e) => setSearchLocalNome(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Filtrar por Sala</option>
            {locais.map(local => (
              <option key={local.id} value={local.nomeLocal}>{local.nomeLocal}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex justify-end mb-4">
        <button onClick={openAddModal} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Adicionar Patrimônio
        </button>
      </div>

      {!isLoading && !error && (
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número Patrimônio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patrimonios.map((patrimonio) => (
                <tr key={patrimonio.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patrimonio.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patrimonio.numeroPatrimonio}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patrimonio.descricaoEquipamento}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patrimonio.localNome || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openEditModal(patrimonio)} className="text-indigo-600 hover:text-indigo-900">Editar</button>
                    <button onClick={() => handleDelete(patrimonio.id)} className="text-red-600 hover:text-red-900 ml-4">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={isEditing ? 'Editar Patrimônio' : 'Adicionar Novo Patrimônio'}>
        <PatrimonioForm
          formData={formData}
          setFormData={setFormData}
          isEditing={isEditing}
          onSubmit={handleSubmit}
          locais={locais}
        />
      </Modal>
    </div>
  );
}

export default Patrimonios;