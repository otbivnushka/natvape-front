import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Api } from '@/api';
import { queryKeys } from './queryKeys';
import { useAuthStore } from '@/store/useAuthStore';
import type { Product } from '@/types';

export function useWishlist() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: queryKeys.wishlist.all,
    queryFn: async () => {
      const res = await Api.wishlist.get();
      return res.items.map(Api.products.mapProduct);
    },
    enabled: !!token,
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  const authToken = useAuthStore((s) => s.token);

  return useMutation({
    mutationFn: async ({ productId, action }: { productId: number; action: 'add' | 'remove' }) => {
      if (!authToken) return;
      if (action === 'remove') {
        await Api.wishlist.remove(productId);
      } else {
        await Api.wishlist.add(productId);
      }
    },
    onMutate: async ({ productId, action }: { productId: number; action: 'add' | 'remove' }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.wishlist.all });
      const prev = queryClient.getQueryData<Product[]>(queryKeys.wishlist.all) ?? [];

      if (action === 'remove') {
        queryClient.setQueryData(
          queryKeys.wishlist.all,
          prev.filter((p) => p.id !== productId),
        );
      } else {
        const detail = queryClient.getQueryData<{ product: Product }>(
          queryKeys.products.detail(productId),
        );
        if (detail?.product) {
          queryClient.setQueryData(queryKeys.wishlist.all, [...prev, detail.product]);
        }
      }

      return { prev };
    },
    onError: (_err: Error, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKeys.wishlist.all, context.prev);
      }
    },
    onSettled: () => {
      if (useAuthStore.getState().isLoggedIn()) {
        queryClient.invalidateQueries({ queryKey: queryKeys.wishlist.all });
      }
    },
  });
}
