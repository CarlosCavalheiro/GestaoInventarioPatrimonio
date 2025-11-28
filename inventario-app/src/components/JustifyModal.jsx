import React, { useState } from 'react';

const JustifyModal = ({ isOpen, onClose, onSubmit, item }) => {
  if (!isOpen) return null;

  const [justificativa, setJustificativa] = useState('');
  
  const handleJustifySubmit = (e) => {
    e.preventDefault();
    onSubmit(justificativa);
    setJustificativa('');
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl p-5 w-full max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Justificar Item Ausente</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleJustifySubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Item:</label>
            <p className="px-3 py-2 border rounded-lg bg-gray-100">{item.numeroPatrimonio}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Justificativa:</label>
            <textarea
              value={justificativa}
              onChange={(e) => setJustificativa(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              rows="4"
              required
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Justificar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JustifyModal;