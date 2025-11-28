import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import MenuAdmin from './MenuAdmin';
import MenuEmployee from './MenuEmployee';

function Layout() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [userName, setUserName] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  useEffect(() => {
    const perfil = localStorage.getItem('perfil');
    setUserProfile(perfil);

    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserName(payload.given_name || 'Usuário');
      } catch (e) {
        console.error('Falha ao decodificar o token');
        setUserName(perfil === 'administrador' ? 'Admin' : 'Funcionário');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil');
    navigate('/login');
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Botão de Menu para Mobile */}
      <header className="bg-white p-4 flex justify-between items-center md:hidden shadow-md">
        <h1 className="text-xl font-bold text-gray-800">Inventário</h1>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </header>

      {/* Menu Lateral */}
      <aside
        className={`bg-gray-800 text-white w-64 p-4 flex flex-col transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:${isMenuOpen ? 'block' : 'hidden'} 
          absolute md:relative inset-y-0 z-50`}
      >
        <div className="flex-1 flex flex-col">
          <h2 className="text-xl font-bold mb-6 flex">
            {userProfile === 'administrador' ? 'Painel do Administrador' : 'Painel do Funcionário'}            
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="m18.75 4.5-7.5 7.5 7.5 7.5m-6-15L5.25 12l7.5 7.5" />
              </svg>
            </button>
          </h2>                    
          <nav className="flex-1">
            {userProfile === 'administrador' ? <MenuAdmin /> : <MenuEmployee />}
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left p-2 rounded hover:bg-red-700 transition-colors"
        >
          Sair
        </button>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-2 overflow-auto" >
        <header className="bg-white p-4 rounded-lg shadow mb-6 flex justify-between items-center">
          <p className="text-gray-600">Bem-vindo, {userName}!</p>          

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600">
            <svg className="hidden md:block text-gray-600 ml-4 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          
        </header>

        <div className="bg-white p-2 rounded-lg shadow">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
