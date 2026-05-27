import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export function useAdminGuard(): void {
  const navigate = useNavigate();

  useEffect(() => {
    if (!useAuthStore.getState().isAdmin()) {
      navigate('/profile', { replace: true });
    }
  }, [navigate]);
}
