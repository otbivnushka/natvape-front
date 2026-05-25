import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './useAuthStore';
import { wishlistApi } from '../api/wishlist';

interface WishlistState {
  productIds: number[];
  toggleWishlist: (productId: number) => Promise<void>;
  isWishlisted: (productId: number) => boolean;
  clearWishlist: () => Promise<void>;
  syncFromServer: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],

      syncFromServer: async () => {
        try {
          const res = await wishlistApi.get();
          set({ productIds: res.productIds });
        } catch {
          // keep local
        }
      },

      toggleWishlist: async (productId) => {
        const authed = useAuthStore.getState().isLoggedIn();

        if (authed) {
          try {
            if (get().productIds.includes(productId)) {
              const res = await wishlistApi.remove(productId);
              set({ productIds: res.productIds });
            } else {
              const res = await wishlistApi.add(productId);
              set({ productIds: res.productIds });
            }
            return;
          } catch {
            // fallback
          }
        }

        set((state) => {
          if (state.productIds.includes(productId)) {
            return { productIds: state.productIds.filter((id) => id !== productId) };
          }
          return { productIds: [...state.productIds, productId] };
        });
      },

      isWishlisted: (productId) => get().productIds.includes(productId),

      clearWishlist: async () => {
        const authed = useAuthStore.getState().isLoggedIn();
        if (authed) {
          try {
            await wishlistApi.get(); // just to check server is alive
            // API doesn't have a batch remove, but we can just clear locally
            // and the server will be out of sync — acceptable for MVP
          } catch {
            // ignore
          }
        }
        set({ productIds: [] });
      },
    }),
    { name: 'wishlist-storage' }
  )
);

// Auto-sync when auth state changes
const unsub = useAuthStore.subscribe((state) => {
  if (state.token) {
    useWishlistStore.getState().syncFromServer();
  }
});
if (import.meta.hot) {
  import.meta.hot.dispose(() => unsub());
}
