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

    // Always redirect to login if not authenticated (except for public paths)
    if (!isAuthenticated && !publicPaths.includes(currentPath)) {
      navigate('/', { state: { from: currentPath }, replace: true });
      return;
    }

    // If authenticated and on a public path, go to dashboard
    if (isAuthenticated && publicPaths.includes(currentPath)) {
      navigate('/dashboard', { replace: true });
      return;
    }
  }, [isAuthenticated, user, navigate, location, clearStore]);

  return children;
}
