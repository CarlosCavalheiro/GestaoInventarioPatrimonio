import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ImportData from './pages/ImportData';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Locais from './pages/Locais';
import Patrimonios from './pages/Patrimonios';
import Inventory from './pages/Inventory';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Sessoes from './pages/Sessoes';
import ItensConferidos from './pages/ItensConferidos';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const perfil = localStorage.getItem('perfil');
    if (token && perfil) {
      try {
        const decodedToken = jwtDecode(token); // Uso da função corrigida
        if (decodedToken.exp * 1000 > Date.now()) {
          return { token, perfil };
        }
      } catch (error) {
        return null;
      }
    }
    return null;
  });

  const handleLogin = (token, perfil) => {
    localStorage.setItem('token', token);
    localStorage.setItem('perfil', perfil);
    setUser({ token, perfil });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        
        <Route path="/" element={<ProtectedRoute user={user} />}>
          <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
             <Route index element={<Dashboard />} />
             <Route path="/admin/import" element={<ImportData />} />
             <Route path="/admin/reports" element={<Reports />} />
             <Route path="/admin/users" element={<Users />} />
             <Route path="/admin/locais" element={<Locais />} />
             <Route path="/admin/patrimonios" element={<Patrimonios />} />
             <Route path="/admin/sessoes" element={<Sessoes />} />
             <Route path="/admin/itens-conferidos" element={<ItensConferidos />} />
             <Route path="/employee/inventory/:localId" element={<Inventory />} />
             <Route path="/employee/conferencias" element={<ItensConferidos />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;