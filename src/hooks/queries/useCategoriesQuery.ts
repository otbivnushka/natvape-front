import { useQuery } from '@tanstack/react-query';
import { Api } from '@/api';
import { queryKeys } from './queryKeys';
import type { ApiCategoryInfo } from '@/api/dto/category.dto';

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => Api.categories.getAll(),
    staleTime: 30 * 60 * 1000,
  });
}

export function useCategoryByKey(key: string) {
  const query = useCategories();
  const cat = query.data?.find((c: ApiCategoryInfo) => c.key === key) ?? null;
  return { ...query, data: cat };
}
