import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from '../utils/Auth';
import { API_URL } from '../utils/Constantes';
import logo from '../assets/logo.png';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(API_URL + '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nomeUsuario: username, senha: password }),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas. Tente novamente.');
      }

      const data = await response.json();
      const token = data.token;
      const decoded = decodeToken(token);
      
      const perfil = decoded?.role; 
      
      if (perfil) {
        onLogin(token, perfil); 
        navigate('/');
      } else {
        throw new Error('Token inválido ou sem perfil de usuário.');
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <img src={logo} alt="Logo" className="h-16 mx-auto mb-4"/>
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">INVENTÁRIO</h2>
        <h1 className="text-2xl font-bold text-center mb-10 text-gray-600">Conferência de Patrimônio</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Usuário:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;