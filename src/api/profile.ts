import { ApiRoutes } from './constants';
import type { ApiProfile } from './dto/profile.dto';
import { axiosInstance } from './instance';

export const get = async (): Promise<ApiProfile> => {
  const { data } = await axiosInstance.get<ApiProfile>(ApiRoutes.PROFILE);
  return data;
};

export const update = async (dto: { name: string }): Promise<{ id: number; name: string }> => {
  const { data } = await axiosInstance.patch<{ id: number; name: string }>(ApiRoutes.PROFILE, dto);
  return data;
};
