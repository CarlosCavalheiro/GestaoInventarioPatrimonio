import { Link } from 'react-router-dom';

function MenuAdmin() {
  return (
    <ul className="space-y-2">
      <li><Link to="/" className="block p-2 rounded hover:bg-gray-700">Dashboard</Link></li>
      <li className='block p-1 rounded bg-gray-600'><p></p></li>
      <li><Link to="/admin/import" className="block p-2 rounded hover:bg-gray-700">Importar Dados</Link></li>
      <li><Link to="/admin/itens-conferidos" className="block p-2 rounded hover:bg-gray-700">Ver Itens Conferidos</Link></li>
      <li><Link to="/admin/reports" className="block p-2 rounded hover:bg-gray-700">Gerar Relatórios</Link></li>
      <li className='block p-1 rounded bg-gray-600'><p></p></li>
      <li><Link to="/admin/users" className="block p-2 rounded hover:bg-gray-700">Gerenciar Usuários</Link></li>
      <li><Link to="/admin/locais" className="block p-2 rounded hover:bg-gray-700">Gerenciar Locais</Link></li>
      <li><Link to="/admin/patrimonios" className="block p-2 rounded hover:bg-gray-700">Gerenciar Patrimônios</Link></li>
      <li><Link to="/admin/sessoes" className="block p-2 rounded hover:bg-gray-700 mb-4">Gerenciar Sessões</Link></li>
      <li className='block p-1 rounded bg-gray-600'><p></p></li>
    </ul>
  );
}

export default MenuAdmin;