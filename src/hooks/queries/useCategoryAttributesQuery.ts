import { useQuery } from '@tanstack/react-query';
import { Api } from '@/api';

export function useCategoryAttributes(categoryId: number | undefined) {
  return useQuery({
    queryKey: ['category-attributes', categoryId],
    queryFn: () => Api.categoryAttributes.getByCategory(categoryId!),
    enabled: Number.isFinite(categoryId),
  });
}
