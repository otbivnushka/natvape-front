import { useQuery } from '@tanstack/react-query';
import { Api } from '@/api';
import { queryKeys } from './queryKeys';

export function usePickups() {
  return useQuery({
    queryKey: queryKeys.addresses.pickups(),
    queryFn: () => Api.addresses.getAllPickups(),
  });
}
