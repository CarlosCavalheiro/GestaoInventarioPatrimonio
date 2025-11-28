import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
import EmployeeDashboard from '../components/EmployeeDashboard';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Recupera o perfil do usuário do localStorage
    const perfil = localStorage.getItem('perfil');
    if (perfil) {
      setUser({ perfil });
    } else {
      // Se não há perfil, redireciona para o login
      navigate('/login');
    }
  }, [navigate]);

  if (!user) {
    return <div>Carregando...</div>;
  }

  // Renderiza o dashboard apropriado com base no perfil
  if (user.perfil === 'administrador') {
    return <AdminDashboard />;
  } else if (user.perfil === 'funcionario') {
    return <EmployeeDashboard />;
  }

  return <div>Perfil não reconhecido.</div>;
}

export default Dashboard;