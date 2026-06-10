import { useQuery } from '@tanstack/react-query';
import { Api } from '@/api';
import { queryKeys } from './queryKeys';
import type { ProductsQuery } from '@/api/dto/product.dto';

export function useProducts(filters?: ProductsQuery) {
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: async () => {
      const res = await Api.products.getAll(filters);
      return {
        items: res.items.map(Api.products.mapProduct),
        meta: res.meta,
      };
    },
  });
}

export function useProduct(id: number, userId?: number) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: async () => {
      const api = await Api.products.getById(id, userId);
      return { product: Api.products.mapProduct(api), userRate: api.userRate };
    },
    enabled: Number.isFinite(id),
  });
}

export function useBrands(category?: string) {
  return useQuery({
    queryKey: [...queryKeys.products.all, 'brands', category] as const,
    queryFn: () => Api.products.getBrands(category),
    enabled: !!category,
  });
}
