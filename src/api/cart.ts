import { ApiRoutes } from './constants';
import type { ApiCartResponse } from './dto/cart.dto';
import { axiosInstance } from './instance';

export const get = async (): Promise<ApiCartResponse> => {
  const { data } = await axiosInstance.get<ApiCartResponse>(ApiRoutes.CART);
  return data;
};

export const add = async (productId: number, quantity: number, variantKey?: string): Promise<ApiCartResponse> => {
  const { data } = await axiosInstance.post<ApiCartResponse>(ApiRoutes.CART, { productId, quantity, variantKey });
  return data;
};

export const updateQty = async (itemId: number, quantity: number): Promise<ApiCartResponse> => {
  const { data } = await axiosInstance.patch<ApiCartResponse>(ApiRoutes.CART_ITEM.replace(':id', String(itemId)), { quantity });
  return data;
};

export const remove = async (itemId: number): Promise<ApiCartResponse> => {
  const { data } = await axiosInstance.delete<ApiCartResponse>(ApiRoutes.CART_ITEM.replace(':id', String(itemId)));
  return data;
};

export const clear = async (): Promise<ApiCartResponse> => {
  const { data } = await axiosInstance.delete<ApiCartResponse>(ApiRoutes.CART);
  return data;
};
