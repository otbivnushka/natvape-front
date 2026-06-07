import { ApiRoutes } from '../constants';
import { axiosInstance } from '../instance';

export const upsert = async (userId: number, productId: number, value: number): Promise<void> => {
  await axiosInstance.post(ApiRoutes.RATES, { userId, productId, value });
};
