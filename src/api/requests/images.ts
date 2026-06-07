import { ApiRoutes } from '../constants';
import type { ApiImage } from '../dto/image.dto';
import { axiosInstance } from '../instance';

export const upload = async (file: File): Promise<ApiImage> => {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await axiosInstance.post<ApiImage>(ApiRoutes.IMAGES_UPLOAD, formData);
  return data;
};

export const remove = async (id: number): Promise<void> => {
  await axiosInstance.delete(ApiRoutes.IMAGES_BY_ID.replace(':id', String(id)));
};
