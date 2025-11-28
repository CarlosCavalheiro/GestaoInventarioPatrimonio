import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
};

const ProtectedRoute = ({ user }) => {
  const token = localStorage.getItem('token');
  if (isTokenExpired(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil');
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
