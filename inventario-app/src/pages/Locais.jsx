import { useState, useEffect } from 'react';
import { API_URL } from '../utils/Constantes';
import Modal from '../components/Modal';

function Locais() {
  const [locais, setLocais] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ id: 0, codigoLocal: '', nomeLocal: '', responsavelId: null });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchNomeLocal, setSearchNomeLocal] = useState('');
  const [searchResponsavelNome, setSearchResponsavelNome] = useState('');

  useEffect(() => {
    fetchData();
  }, [searchNomeLocal, searchResponsavelNome]);

  const fetchData = async () => {

    try {
      const queryParams = new URLSearchParams({
        ...(searchNomeLocal && { nomeLocal: searchNomeLocal }),
        ...(searchResponsavelNome && { responsavelNome: searchResponsavelNome }),
      }).toString();

      const locaisResponse = await fetch(`${API_URL}/Locais?${queryParams}`, {
        headers: {},
      });
      const locaisData = await locaisResponse.json();
      setLocais(locaisData);

      const usuariosResponse = await fetch(`${API_URL}/Usuarios`, {
        headers: {},
      });
      const usuariosData = await usuariosResponse.json();
      setUsuarios(usuariosData);
      
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
    setFormData({ id: 0, codigoLocal: '', nomeLocal: '', responsavelId: null });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (local) => {
    setFormData({ id: local.id, codigoLocal: local.codigoLocal, nomeLocal: local.nomeLocal, responsavelId: local.responsavelId });
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
    const url = `${API_URL}/Locais/${isEditing ? formData.id : ''}`;

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
        throw new Error('Falha ao salvar o local.');
      }

      closeModal();
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (window.confirm('Tem certeza que deseja excluir este local?')) {
      try {
        const response = await fetch(`${API_URL}/Locais/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Falha ao excluir o local.');
        }

        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Gerenciar Locais</h2>
      {isLoading && <p>Carregando lista de locais...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {/* Formulário de Busca */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            value={searchNomeLocal}
            onChange={(e) => setSearchNomeLocal(e.target.value)}
            placeholder="Filtrar por Nome do Local"
            className="w-full px-3 py-2 border rounded-lg"
          />
          <select
            value={searchResponsavelNome}
            onChange={(e) => setSearchResponsavelNome(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Filtrar por Responsável</option>
            {usuarios.map(usuario => (
              <option key={usuario.id} value={usuario.nomeCompleto}>{usuario.nomeCompleto}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex justify-end mb-4">
        <button onClick={openAddModal} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Adicionar Local
        </button>
      </div>

      {!isLoading && !error && (
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Local</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {locais.map((local) => (
                <tr key={local.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{local.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{local.codigoLocal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{local.nomeLocal}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{local.responsavelNomeCompleto || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openEditModal(local)} className="text-indigo-600 hover:text-indigo-900">Editar</button>
                    <button onClick={() => handleDelete(local.id)} className="text-red-600 hover:text-red-900 ml-4">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={isEditing ? 'Editar Local' : 'Adicionar Novo Local'}>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2">Código do Local</label>
              <input
                type="text"
                name="codigoLocal"
                value={formData.codigoLocal}
                onChange={handleInputChange}
                placeholder="Ex: A-101"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Nome do Local</label>
              <input
                type="text"
                name="nomeLocal"
                value={formData.nomeLocal}
                onChange={handleInputChange}
                placeholder="Ex: Sala de Reunião"
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-2">Responsável</label>
              <select
                name="responsavelId"
                value={formData.responsavelId || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Nenhum</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id} value={usuario.id}>{usuario.nomeCompleto || usuario.nomeUsuario}</option>
                ))}
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            {isEditing ? 'Salvar Edição' : 'Adicionar Local'}
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default Locais;