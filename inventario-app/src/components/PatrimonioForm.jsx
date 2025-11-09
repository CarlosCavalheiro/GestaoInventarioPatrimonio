import { API_URL } from '../utils/Constantes';
import Modal from './Modal';

function PatrimonioForm({ formData, setFormData, isEditing, onSubmit, locais }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-bold mb-2">Número do Patrimônio</label>
          <input
            type="text"
            name="numeroPatrimonio"
            value={formData.numeroPatrimonio}
            onChange={handleInputChange}
            placeholder="Ex: 123456"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">Descrição do Equipamento</label>
          <input
            type="text"
            name="descricaoEquipamento"
            value={formData.descricaoEquipamento}
            onChange={handleInputChange}
            placeholder="Ex: Notebook HP"
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">Local</label>
          <select
            name="localId"
            value={formData.localId || ''}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Selecione um Local</option>
            {locais.map((local) => (
              <option key={local.id} value={local.id}>{local.nomeLocal}</option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
      >
        {isEditing ? 'Salvar Edição' : 'Adicionar Patrimônio'}
      </button>
    </form>
  );
}

export default PatrimonioForm;