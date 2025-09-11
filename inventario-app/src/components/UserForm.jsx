
function UserForm({ formData, setFormData, isEditing, onSubmit }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Nome de Usuário (SN)</label>
          <input
            type="text"
            name="nomeUsuario"
            value={formData.nomeUsuario}
            onChange={handleInputChange}
            placeholder="Nome de Usuário"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">Nome Completo</label>
          <input
            type="text"
            name="nomeCompleto"
            value={formData.nomeCompleto}
            onChange={handleInputChange}
            placeholder="Nome Completo"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">{isEditing ? 'Nova Senha' : 'Senha'}</label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleInputChange}
            placeholder={isEditing ? 'Deixe em branco para manter' : 'Senha'}
            className="w-full px-3 py-2 border rounded-lg"
            required={!isEditing}
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">Perfil</label>
          <select
            name="perfil"
            value={formData.perfil}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="funcionario">Funcionário</option>
            <option value="administrador">Administrador</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        {isEditing ? 'Salvar Edição' : 'Adicionar Usuário'}
      </button>
    </form>
  );
}

export default UserForm;