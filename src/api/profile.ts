import { ApiRoutes } from './constants';
import type { ApiProfile } from './dto/profile.dto';
import { axiosInstance } from './instance';

export const get = async (): Promise<ApiProfile> => {
  const { data } = await axiosInstance.get<ApiProfile>(ApiRoutes.PROFILE);
  return data;
};

export const update = async (dto: Partial<Pick<ApiProfile, 'name' | 'phone' | 'avatar'>>): Promise<ApiProfile> => {
  const { data } = await axiosInstance.patch<ApiProfile>(ApiRoutes.PROFILE, dto);
  return data;
};
