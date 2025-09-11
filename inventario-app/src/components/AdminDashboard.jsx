
import { Link } from 'react-router-dom';
import { API_URL } from '../utils/Constantes';

function AdminDashboard() {

  const summary = {
    totalPatrimonios: 0,
    totalLocais: 0,
    totalResponsaveis: 0,
    totalItensConferidos: 0,
    totalInconsistencias: 0,
  };
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Painel do Administrador</h1>
      
      <h2 className="text-xl font-bold mb-4">Resumo Geral</h2>      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2">Total de Patrimônios</h3>
            <p className="text-3xl font-bold text-gray-800">{summary.totalPatrimonios}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2">Total de Locais</h3>
            <p className="text-3xl font-bold text-gray-800">{summary.totalLocais}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2">Total de Responsáveis</h3>
            <p className="text-3xl font-bold text-gray-800">{summary.totalResponsaveis}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2">Itens Conferidos</h3>
            <p className="text-3xl font-bold text-gray-800">{summary.totalItensConferidos}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2">Inconsistências</h3>
            <p className="text-3xl font-bold text-gray-800">{summary.totalInconsistencias}</p>
          </div>
        </div>      
    </div>
  );
}

export default AdminDashboard;