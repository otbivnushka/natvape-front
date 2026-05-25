import { api } from './client';

export interface WishlistResponse {
  productIds: number[];
}

export const wishlistApi = {
  get: () =>
    api.get<WishlistResponse>('/wishlist'),

  add: (productId: number) =>
    api.post<WishlistResponse>('/wishlist', { productId }),

  remove: (productId: number) =>
    api.delete<WishlistResponse>(`/wishlist/${productId}`),
};
