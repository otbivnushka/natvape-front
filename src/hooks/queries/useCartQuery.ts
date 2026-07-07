import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Api } from '@/api';
import { queryKeys } from './queryKeys';
import { useAuthStore } from '@/store/useAuthStore';
import { useToastStore } from '@/store/useToastStore';
import type { ApiCartItem } from '@/api/dto/cart.dto';
import type { CartItem, Product } from '@/types';
import { sortCartItems } from '@/utils/sortCartItems';

let localId = 0;
const nextId = () => --localId;

function mapApiItem(i: ApiCartItem): CartItem {
  const product: Product = {
    id: i.product.id,
    name: i.product.name,
    price: i.product.price,
    doublePrice: i.product.doublePrice ?? null,
    image: i.product.image,
    imageId: i.product.imageId ?? null,
    rating: 0,
    description: '',
    brand: i.product.brand,
    badge: i.product.badge,
    category: i.product.category.key as Product['category'],
    visible: true,
    attributes: [],
  };

  return {
    id: i.id,
    product,
    quantity: i.quantity,
    variantKey: i.variantKey ?? undefined,
    variantName: i.variantName ?? undefined,
  };
}

export function useCart() {
  const token = useAuthStore((s) => s.token);

  return useQuery({
    queryKey: queryKeys.cart.all,
    queryFn: async () => {
      const res = await Api.cart.get();
      return sortCartItems(res.items.map(mapApiItem));
    },
    enabled: !!token,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const authToken = useAuthStore((s) => s.token);

  return useMutation({
    mutationFn: async ({
      productId,
      variantKey,
      variantName,
      quantity = 1,
    }: {
      productId: number;
      variantKey?: string;
      variantName?: string;
      quantity?: number;
    }) => {
      if (!authToken) return;
      await Api.cart.add(productId, quantity, variantKey, variantName);
    },
    onMutate: async ({
      productId,
      variantKey,
      variantName,
      quantity = 1,
    }: {
      productId: number;
      variantKey?: string;
      variantName?: string;
      quantity?: number;
    }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.all });
      const prev = queryClient.getQueryData<CartItem[]>(queryKeys.cart.all) ?? [];

      const key = `${productId}:${variantKey ?? ''}`;
      const existing = prev.find((i) => `${i.product.id}:${i.variantKey ?? ''}` === key);

      let next: CartItem[];
      if (existing) {
        next = sortCartItems(
          prev.map((i) =>
            `${i.product.id}:${i.variantKey ?? ''}` === key
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          ),
        );
      } else {
        const cached = queryClient.getQueryData(queryKeys.products.detail(productId));
        const product = cached
          ? Array.isArray(cached)
            ? undefined
            : (cached as { product: Product }).product
          : undefined;

        next = sortCartItems([
          ...prev,
          {
            id: nextId(),
            product:
              product ??
              ({
                id: productId,
                name: `Товар #${productId}`,
                price: 0,
                doublePrice: null,
                rating: 0,
                image: '',
                imageId: null,
                description: '',
                brand: '',
                badge: null,
                category: 'liquids',
                visible: true,
                attributes: [],
              } as Product),
            quantity,
            variantKey,
            variantName,
          },
        ]);
      }

      queryClient.setQueryData(queryKeys.cart.all, next);
      return { prev };
    },
    onError: (_err: Error, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKeys.cart.all, context.prev);
      }
      const msg = (_err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      if (msg) useToastStore.getState().addToast(msg);
    },
    onSettled: () => {
      if (useAuthStore.getState().isLoggedIn()) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      }
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (itemId: number) => {
      const authed = useAuthStore.getState().isLoggedIn();
      if (authed) {
        try {
          await Api.cart.remove(itemId);
        } catch {
          /* fallback */
        }
      }
    },
    onMutate: async (itemId: number) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.all });
      const prev = queryClient.getQueryData<CartItem[]>(queryKeys.cart.all) ?? [];
      queryClient.setQueryData(
        queryKeys.cart.all,
        sortCartItems(prev.filter((i) => i.id !== itemId)),
      );
      return { prev };
    },
    onError: (_err: Error, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKeys.cart.all, context.prev);
      }
    },
    onSettled: () => {
      if (useAuthStore.getState().isLoggedIn()) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      }
    },
  });
}

export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      const authed = useAuthStore.getState().isLoggedIn();
      if (authed) {
        if (quantity <= 0) {
          await Api.cart.remove(itemId);
        } else {
          await Api.cart.updateQty(itemId, quantity);
        }
      }
    },
    onMutate: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.all });
      const prev = queryClient.getQueryData<CartItem[]>(queryKeys.cart.all) ?? [];

      if (quantity <= 0) {
        queryClient.setQueryData(
          queryKeys.cart.all,
          sortCartItems(prev.filter((i) => i.id !== itemId)),
        );
      } else {
        queryClient.setQueryData(
          queryKeys.cart.all,
          sortCartItems(prev.map((i) => (i.id === itemId ? { ...i, quantity } : i))),
        );
      }

      return { prev };
    },
    onError: (_err: Error, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKeys.cart.all, context.prev);
      }
      const msg = (_err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      if (msg) useToastStore.getState().addToast(msg);
    },
    onSettled: () => {
      if (useAuthStore.getState().isLoggedIn()) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      }
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const authed = useAuthStore.getState().isLoggedIn();
      if (authed) {
        try {
          await Api.cart.clear();
        } catch {
          /* fallback */
        }
      }
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.all });
      const prev = queryClient.getQueryData<CartItem[]>(queryKeys.cart.all) ?? [];
      queryClient.setQueryData(queryKeys.cart.all, []);
      return { prev };
    },
    onError: (_err: Error, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKeys.cart.all, context.prev);
      }
    },
    onSettled: () => {
      if (useAuthStore.getState().isLoggedIn()) {
        queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      }
    },
  });
}
