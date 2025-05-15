import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from '../../store/useStore';

export default function AuthWrapper({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useStore((state) => state.user);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const clearStore = useStore((state) => state.clearStore);

  useEffect(() => {
    // Clear any potentially corrupted state on mount
    if (!user && isAuthenticated) {
      clearStore();
    }
  }, []);

  useEffect(() => {
    const publicPaths = ['/', '/login', '/signup'];
    const currentPath = location.pathname;

    // Only redirect to login if not authenticated and trying to access a protected route
    if (!isAuthenticated && !publicPaths.includes(currentPath)) {
      navigate('/login', { state: { from: currentPath }, replace: true });
      return;
    }

    // If authenticated and on a public path, go to dashboard
    if (isAuthenticated && publicPaths.includes(currentPath) && currentPath !== '/signup') {
      navigate('/dashboard', { replace: true });
      return;
    }
  }, [isAuthenticated, navigate, location.pathname]);

  return children;
}
