import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export function ProtectedRoute({ children }: { children: ReactElement }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="center">Carregando...</p>;
  return user ? children : <Navigate to="/login" replace />;
}
