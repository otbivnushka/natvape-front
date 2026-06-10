import { useQuery } from '@tanstack/react-query';
import { Api } from '@/api';
import { queryKeys } from './queryKeys';

export function useOrders() {
  return useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: () => Api.orders.getAll(),
  });
}

export function useSentOrders() {
  return useQuery({
    queryKey: queryKeys.orders.sent(),
    queryFn: () => Api.admin.getSentOrders(),
  });
}
