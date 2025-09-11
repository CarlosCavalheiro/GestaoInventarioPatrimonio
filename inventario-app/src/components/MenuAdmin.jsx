import { Link } from 'react-router-dom';

function MenuAdmin() {
  return (
    <ul className="space-y-2">
      <li><Link to="/" className="block p-2 rounded hover:bg-gray-700">Dashboard</Link></li>      
      <li><Link to="/admin/users" className="block p-2 rounded hover:bg-gray-700">Gerenciar Usuários</Link></li>
      <li><Link to="/admin/locais" className="block p-2 rounded hover:bg-gray-700">Gerenciar Locais</Link></li>
      <li><Link to="/admin/patrimonios" className="block p-2 rounded hover:bg-gray-700">Gerenciar Patrimônios</Link></li>      
      <li><Link to="/admin/sessoes" className="block p-2 rounded hover:bg-gray-700">Gerenciar Sessões</Link></li>
      <li><Link to="/admin/itens-conferidos" className="block p-2 rounded hover:bg-gray-700">Ver Itens Conferidos</Link></li>
    </ul>
  );
}

export default MenuAdmin;