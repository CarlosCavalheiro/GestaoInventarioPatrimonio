import { useEffect, useState } from 'react';
import { API_URL } from '../utils/Constantes';
import { useNavigate, Link } from 'react-router-dom';

function EmployeeDashboard() {
  const [locais, setLocais] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMeusLocais = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Token não encontrado. Faça login novamente.");
        setIsLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`${API_URL}/Locais/meus-locais`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Falha ao buscar seus locais.");
        }
        
        const data = await response.json();
        setLocais(data);
      } catch (err) {
        console.error('Erro ao buscar locais:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMeusLocais();
  }, [navigate]);

  if (isLoading) return <p>Carregando dados...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Painel do Funcionário</h1>
      <p>Bem-vindo! Selecione sua sala para iniciar a conferência.</p>
      
      {locais.length > 0 ? (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">Locais sob sua responsabilidade:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {locais.map(local => (
              <Link key={local.id} to={`/employee/inventory/${local.id}`} className="bg-white p-6 rounded-lg shadow-md hover:bg-gray-100 transition-colors cursor-pointer">
                <p className="text-lg font-bold">{local.nomeLocal}</p>
                
                <p className="text-sm text-gray-600">Código: {local.codigoLocal}</p>
                <div className="mt-4 border-t pt-4 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold text-blue-500">{local.itensConferidos || 0}</p>
                    <p className="text-sm text-gray-600">Conferidos</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-gray-500">{local.totalPatrimonios || 0}</p>
                    <p className="text-sm text-gray-600">Total</p>
                  </div>
                </div>
                {local.totalInconsistencias > 0 && (
                  <p className="mt-2 text-sm text-red-500 font-bold">{local.totalInconsistencias} Inconsistência(s)</p>
                )}
                {local.totalJustificados > 0 && (
                    <p className="mt-2 text-sm text-blue-500 font-bold">{local.totalJustificados} Justificado(s)</p>
                  )}   
                {local.totalItensForaPatrimonio > 0 && (
                  <p className="mt-2 text-sm text-orange-500 font-bold">{local.totalItensForaPatrimonio} Fora da Lista de Patrimônio 7.92</p>
                )}   
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-4">Você não tem um local atribuído. Por favor, contate o administrador.</p>
      )}
    </div>
  );
}

export default EmployeeDashboard;