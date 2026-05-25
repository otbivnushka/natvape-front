import { ApiRoutes } from './constants';
import type { WishlistResponse } from './dto/wishlist.dto';
import { axiosInstance } from './instance';

export const get = async (): Promise<WishlistResponse> => {
  const { data } = await axiosInstance.get<WishlistResponse>(ApiRoutes.WISHLIST);
  return data;
};

export const add = async (productId: number): Promise<WishlistResponse> => {
  const { data } = await axiosInstance.post<WishlistResponse>(ApiRoutes.WISHLIST, { productId });
  return data;
};

export const remove = async (productId: number): Promise<WishlistResponse> => {
  const { data } = await axiosInstance.delete<WishlistResponse>(ApiRoutes.WISHLIST_ITEM.replace(':productId', String(productId)));
  return data;
};
