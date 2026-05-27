import { ApiRoutes } from './constants';
import type { ApiTelegramAuthResponse } from './dto/auth.dto';
import { axiosInstance } from './instance';

export const telegramAuth = async (initData: string): Promise<ApiTelegramAuthResponse> => {
  const { data } = await axiosInstance.post<ApiTelegramAuthResponse>(ApiRoutes.TELEGRAM_AUTH, { initData });
  return data;
};
