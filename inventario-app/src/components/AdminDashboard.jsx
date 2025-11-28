import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../utils/Constantes';
import { Line, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,    
    Title,
    Tooltip,
    Legend
);

function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itensLocalConferidos, setItensLocalConferidos] = useState([]);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError("Token não encontrado. Faça login novamente.");
      setIsLoading(false);
      return;
    }

    const fetchSummary = async () => {
      try {
        const response = await fetch(API_URL + '/Admin/summary', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },          
        });        

        if (!response.ok) {
          throw new Error('Falha ao buscar o resumo do dashboard.');
        }

        const data = await response.json();
        setSummary(data);        
      } catch (err) {
        console.error('Erro ao buscar o resumo:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchConferencias = async () => {      
      try {
        const responseLocais = await fetch(API_URL + '/Admin/dashboard-conferencias', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },          
        });        

        if (!responseLocais.ok) {
          throw new Error('Falha ao buscar o resumo dos Locais.');
        }
        const responseLocaisData = await responseLocais.json();
        console.log(responseLocaisData);
        setItensLocalConferidos(responseLocaisData);

      } catch (err) {
        console.error('Erro ao buscar conferência:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConferencias();
    fetchSummary();
  }, []);

  const chartData = {
        labels: itensLocalConferidos.map(item => item.nomeLocal),
        datasets: [
            {
                label: 'Patrimônio',
                data: itensLocalConferidos.map(item => item.totalItens),
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                tension: 0.4,
                fill: false,
            },
            {
                label: 'Conferidos',
                data: itensLocalConferidos.map(item => item.totalItensConferidos),
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.5)',
                tension: 0.4,
                fill: false,
            },
             {
                label: 'Inconsistências',
                data: itensLocalConferidos.map(item => item.totalInconsistencias),
                borderColor: 'rgba(185, 36, 16, 1)',
                backgroundColor: 'rgba(185, 16, 16, 0.5)',
                tension: 0.4,
                fill: false,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: false },
        },
    };

    const percentualConferido = 0;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Administrador</h1>
      
      {/* <nav className="mb-8">
        <ul className="flex space-x-4">
          <li><Link to="/admin/import" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">Importar Dados</Link></li>
          <li><Link to="/admin/reports" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Ver Relatórios</Link></li>
        </ul>
      </nav> */}

      <h2 className="text-xl font-bold mb-4">Resumo Geral</h2>
      {isLoading && <p>Carregando dados...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {summary && (
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
        </div>
      )}
      <h2 className="text-xl font-bold mb-4 mt-4">Indicadores Conferência Atual</h2>

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">          
          <div className="bg-green-200 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2 text-green-800">Itens Conferidos</h3>
            <p className="text-3xl font-bold text-green-800">{summary.totalItensConferidos}</p>
          </div>
          <div className="bg-orange-200 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2 text-orange-800">Itens Conferidos Fora da Lista</h3>
            <p className="text-3xl font-bold text-orange-800">{summary.totalItensForaPatrimonio}</p>
          </div>
          <div className="bg-red-200 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2 text-red-800">Inconsistências</h3>
            <p className="text-3xl font-bold text-red-800">{summary.totalInconsistencias}</p>
          </div>
           <div className="bg-yellow-200 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-2 text-yellow-800">Percentual de Conferência</h3>            
            <p className="text-3xl font-bold text-yellow-800">{(summary.totalItensConferidos / summary.totalPatrimonios * 100).toFixed(2)}%</p>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4 mt-4">Visão Conferência Atual</h2>

       {itensLocalConferidos.length > 0 ? (
                    <>
                      {/* <Line options={chartOptions} data={chartData} /> */}
                      <Bar options={chartOptions} data={chartData} />
                    </>
                        
                    ) : (
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                            [Nenhum dado de despesa para exibir]
                        </div>
                    )}

      <h2 className="text-xl font-bold mb-4 mt-4">Conferência por Ambiente</h2>

      {itensLocalConferidos &&                         
        <div className="mt-4">          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {itensLocalConferidos.map((local, index) => (
              <>                
                <Link key={local.localId} to={`/employee/inventory/${local.localId}`} className={`${(local.totalItensConferidos / local.totalItens) >= 1 ? 'bg-green-200' : (local.totalItensConferidos == 0) ? 'bg-red-200' : 'bg-white'} p-6 rounded-lg shadow-md hover:bg-gray-100 transition-colors cursor-pointer`}>                                                 
                  <p className="text-lg font-bold">
                    {(local.totalItensConferidos / local.totalItens) >= 1 ? '🟢 ' : (local.totalItensConferidos == 0) ? '🔴 ' : '🟡 '}
                    {local.nomeLocal}</p>
                  <p className="text-sm text-gray-600">{local.nomeCompleto}</p>
                  <div className="mt-4 border-t pt-4 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xl font-bold text-green-600">{((local.totalItensConferidos / local.totalItens)*100).toFixed(2)}%</p>
                      <p className="text-sm text-gray-600">Percentual</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-blue-500">{local.totalItensConferidos || 0}</p>
                      <p className="text-sm text-gray-600">Conferidos</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-500">{local.totalItens || 0}</p>
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
              </>               
            ))}
          </div>
        </div>        
      }


    </div>
  );
}

export default AdminDashboard;