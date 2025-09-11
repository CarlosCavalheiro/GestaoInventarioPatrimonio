import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import MenuAdmin from './MenuAdmin';

function Layout() {
    const [isMenuOpen, setIsMenuOpen] = useState(true);

  
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      
      {/* Cabeçalho */}
      
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
          <h2 className="text-xl font-bold mb-6">
            Painel do Administrador
          </h2>
          
          
          <nav className="flex-1">
            <MenuAdmin />
          </nav>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-2 overflow-auto">
        <header className="bg-white p-4 rounded-lg shadow mb-6 flex justify-between items-center">
          <p className="text-gray-600">Bem-vindo</p>          

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
