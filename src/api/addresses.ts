import { ApiRoutes } from './constants';
import type { Address } from '../types';
import { axiosInstance } from './instance';

export const getAll = async (): Promise<Address[]> => {
  const { data } = await axiosInstance.get<Address[]>(ApiRoutes.ADDRESSES);
  return data;
};

export const create = async (dto: {
  label: string;
  lat: number;
  lng: number;
}): Promise<Address> => {
  const { data } = await axiosInstance.post<Address>(ApiRoutes.ADDRESSES, dto);
  return data;
};

export const remove = async (id: number): Promise<void> => {
  await axiosInstance.delete(ApiRoutes.ADDRESS_BY_ID.replace(':id', String(id)));
};
