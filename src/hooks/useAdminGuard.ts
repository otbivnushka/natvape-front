import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export function useAdminGuard(): void {
  const navigate = useNavigate();
  const isAdmin = useAuthStore((s) => s.isAdmin);

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/profile', { replace: true });
    }
  }, []);
}
