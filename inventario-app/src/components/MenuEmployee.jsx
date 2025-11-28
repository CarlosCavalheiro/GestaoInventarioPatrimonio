import { Link } from 'react-router-dom';

function MenuEmployee() {
  return (
    <ul className="space-y-2">
      <li><Link to="/" className="block p-2 rounded hover:bg-gray-700">Dashboard</Link></li>
      <li><Link to="/employee/conferencias" className="block p-2 rounded hover:bg-gray-700">Ver Minhas Conferências</Link></li>
    </ul>
  );
}

export default MenuEmployee;