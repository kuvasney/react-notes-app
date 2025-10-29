import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn) {
      // Salva a URL atual para redirecionar após o login (opcional)
      sessionStorage.setItem('redirectAfterLogin', location.pathname);
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, navigate, location.pathname]);

  // Se não estiver logado, não renderiza nada (ou pode renderizar um loading)
  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}