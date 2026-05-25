import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './useAuthStore';
import { cartApi, type ApiCartItem } from '../api/cart';
import { productCache } from '../api/product-cache';
import type { Product, CartItem } from '../types';

let localId = 0;
const nextId = () => --localId;

interface CartState {
  items: CartItem[];
  addToCart: (productId: number, variantKey?: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  increaseQty: (itemId: number) => Promise<void>;
  decreaseQty: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: () => number;
  subtotal: () => number;
  syncFromServer: () => Promise<void>;
}

function mapApiItem(i: ApiCartItem): CartItem {
  const cached = productCache.get(i.product.id);
  const product = cached ?? {
    id: i.product.id,
    name: i.product.name,
    price: i.product.price,
    image: i.product.image,
    rating: 0,
    description: '',
    brand: i.product.brand,
    badge: i.product.badge,
    category: i.product.category.key as Product['category'],
  } as Product;
  return {
    id: i.id,
    product,
    quantity: i.quantity,
    variantKey: i.variantKey ?? undefined,
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      syncFromServer: async () => {
        try {
          const res = await cartApi.get();
          set({ items: res.items.map(mapApiItem) });
        } catch {
          // Server not available — keep local state
        }
      },

      addToCart: async (productId, variantKey?, quantity = 1) => {
        const authed = useAuthStore.getState().isLoggedIn();

        if (authed) {
          try {
            const res = await cartApi.add(productId, quantity, variantKey);
            set({ items: res.items.map(mapApiItem) });
            return;
          } catch {
            // fallback to local
          }
        }

        const key = `${productId}:${variantKey ?? ''}`;
        set((state) => {
          const existing = state.items.find(
            (i) => `${i.product.id}:${i.variantKey ?? ''}` === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                `${i.product.id}:${i.variantKey ?? ''}` === key
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          const cached = productCache.get(productId);
          const product = cached ?? { id: productId, name: `Товар #${productId}`, price: 0, rating: 0, image: '', description: '', brand: '', category: 'liquids' } as Product;
          return { items: [...state.items, { id: nextId(), product, quantity, variantKey }] };
        });
      },

      removeFromCart: async (itemId) => {
        const authed = useAuthStore.getState().isLoggedIn();

        if (authed) {
          try {
            const res = await cartApi.remove(itemId);
            set({ items: res.items.map(mapApiItem) });
            return;
          } catch {
            // fallback
          }
        }

        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));
      },

      increaseQty: async (itemId) => {
        const authed = useAuthStore.getState().isLoggedIn();
        const item = get().items.find((i) => i.id === itemId);
        if (!item) return;

        if (authed) {
          try {
            const res = await cartApi.updateQty(itemId, item.quantity + 1);
            set({ items: res.items.map(mapApiItem) });
            return;
          } catch {
            // fallback
          }
        }

        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }));
      },

      decreaseQty: async (itemId) => {
        const authed = useAuthStore.getState().isLoggedIn();
        const item = get().items.find((i) => i.id === itemId);
        if (!item) return;

        if (authed) {
          try {
            const nextQty = item.quantity - 1;
            if (nextQty <= 0) {
              const res = await cartApi.remove(itemId);
              set({ items: res.items.map(mapApiItem) });
            } else {
              const res = await cartApi.updateQty(itemId, nextQty);
              set({ items: res.items.map(mapApiItem) });
            }
            return;
          } catch {
            // fallback
          }
        }

        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === itemId
                ? { ...i, quantity: i.quantity - 1 }
                : i
            )
            .filter((i) => i.quantity > 0),
        }));
      },

      clearCart: async () => {
        const authed = useAuthStore.getState().isLoggedIn();

        if (authed) {
          try {
            const res = await cartApi.clear();
            set({ items: res.items.map(mapApiItem) });
            return;
          } catch {
            // fallback
          }
        }

        set({ items: [] });
      },

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + (i.product.price ?? 0) * i.quantity, 0),
    }),
    { name: 'cart-storage' }
  )
);

// Auto-sync when auth state changes
const unsub = useAuthStore.subscribe((state) => {
  if (state.token) {
    useCartStore.getState().syncFromServer();
  }
});
// Keep reference for cleanup (won't actually be called in practice)
if (import.meta.hot) {
  import.meta.hot.dispose(() => unsub());
}
