import { useQuery } from '@tanstack/react-query';
import { Api } from '@/api';

export function useAttributeValues(category: string | undefined) {
  return useQuery({
    queryKey: ['attribute-values', category],
    queryFn: () => Api.products.getAttributeValues(category!),
    enabled: !!category,
    staleTime: 30 * 60 * 1000,
  });
}
