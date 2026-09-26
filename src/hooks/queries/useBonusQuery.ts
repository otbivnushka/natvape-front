import { useQuery } from '@tanstack/react-query';
import { Api } from '@/api';
import { useAuthStore } from '@/store/useAuthStore';
import { queryKeys } from './queryKeys';

export function useBonus() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  return useQuery({
    queryKey: queryKeys.bonus.all,
    queryFn: () => Api.bonus.get(),
    enabled: isLoggedIn,
  });
}
