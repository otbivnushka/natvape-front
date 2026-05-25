import { api } from './client';

export interface ApiLoginResponse {
  accessToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    phone: string | null;
  };
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiLoginResponse>('/auth/login', { email, password }),

  register: (data: RegisterDto) =>
    api.post<{ id: number; name: string; email: string }>('/auth/register', data),

  logout: () =>
    api.post<{ message: string }>('/auth/logout'),
};
