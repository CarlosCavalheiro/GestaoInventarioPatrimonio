import React from 'react';

function InventoryLists({ patrimonios, conferidos, inconsistencias }) {
  return (
    <>
      {/* Lista de Patrimônios Esperados */}
      <div className="bg-white p-0 mt-6">
        <h3 className="text-lg font-bold mb-4">Itens Esperados nesta Sala ({patrimonios.length})</h3>
        <ul className="space-y-2">
          {patrimonios.map((patrimonio) => (
            <li 
              key={patrimonio.id} 
              className={`p-3 rounded-lg border flex items-center justify-between ${
                conferidos.includes(patrimonio.numeroPatrimonio) 
                  ? 'bg-green-100 border-green-500 text-green-700' 
                  : 'bg-gray-50 border-gray-200 text-gray-700'
              }`}
            >
              <span className='text-md'>
                <span className="font-semibold">{patrimonio.numeroPatrimonio}</span> - {patrimonio.descricaoEquipamento}
              </span>
              {conferidos.includes(patrimonio.numeroPatrimonio) && (
                <span className="text-green-500 font-bold">✔</span>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Lista de Inconsistências (Itens fora da sala) */}
      <div className="bg-red-100 p-1 rounded-lg shadow-md mt-6">
        <h3 className="text-lg font-bold mb-4 text-red-700">Itens fora desta Sala ({inconsistencias.length})</h3>
        <ul className="space-y-2">
          {inconsistencias.map((item, index) => (
            <li key={index} className="p-3 rounded-lg border border-red-500 flex items-center justify-between">
              <span>
                <span className="font-semibold">{item.numeroPatrimonio} - </span>
                <span className="text-sm">{item.patrimonioNome} </span>
                <br></br>
                <span className="text-sm">Local Esperado: {item.localEsperado}</span>
              </span>              
              <span className="text-red-500 font-bold">!</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default InventoryLists;