import { ApiRoutes } from './constants';
import type { ApiLoginResponse, RegisterDto } from './dto/auth.dto';
import { axiosInstance } from './instance';

export const login = async (email: string, password: string): Promise<ApiLoginResponse> => {
  const { data } = await axiosInstance.post<ApiLoginResponse>(ApiRoutes.LOGIN, { email, password });
  return data;
};

export const register = async (dto: RegisterDto): Promise<{ id: number; name: string; email: string }> => {
  const { data } = await axiosInstance.post<{ id: number; name: string; email: string }>(ApiRoutes.REGISTER, dto);
  return data;
};

export const logout = async (): Promise<void> => {
  await axiosInstance.post(ApiRoutes.LOGOUT);
};
