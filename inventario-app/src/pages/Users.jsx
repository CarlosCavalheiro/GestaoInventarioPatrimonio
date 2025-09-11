import { useState, useEffect } from 'react';
import { API_URL } from '../utils/Constantes';
import Modal from '../components/Modal';
import UserForm from '../components/UserForm';

function Users() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ id: 0, nomeUsuario: '', nomeCompleto: '', senha: '', perfil: 'funcionario' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {  
    try {
      const usersResponse = await fetch(`${API_URL}/Usuarios`, { method: 'GET'        
      });
      const usersData = await usersResponse.json();
      setUsers(usersData);

    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError('Falha ao carregar os dados. Verifique a conexão com a API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setFormData({ id: user.id, nomeUsuario: user.nomeUsuario, nomeCompleto: user.nomeCompleto, senha: '', perfil: user.perfil });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setFormData({ id: 0, nomeUsuario: '', nomeCompleto: '', senha: '', perfil: 'funcionario' });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();    
    const method = isEditing ? 'PUT' : 'POST';
    const url = `${API_URL}/Usuarios/${isEditing ? formData.id : ''}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',          
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Falha ao salvar o usuário.');
      }

      closeModal();
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        const response = await fetch(`${API_URL}/Usuarios/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error('Falha ao excluir o usuário.');
        }

        fetchUsers();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Gerenciar Usuários</h2>
      {isLoading && <p>Carregando lista de usuários...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="flex justify-end mb-4">
        <button onClick={handleAddClick} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Adicionar Usuário
        </button>
      </div>

      {!isLoading && !error && (
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome Completo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Perfil</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.nomeUsuario}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.nomeCompleto}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.perfil}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleEditClick(user)} className="text-indigo-600 hover:text-indigo-900">Editar</button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-900 ml-4">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} title={isEditing ? 'Editar Usuário' : 'Adicionar Novo Usuário'}>
        <UserForm
          formData={formData}
          setFormData={setFormData}
          isEditing={isEditing}
          onSubmit={handleSubmit}
          locais={[]}
        />
      </Modal>
    </div>
  );
}

export default Users;