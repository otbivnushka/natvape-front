import axios from 'axios';

let getToken: (() => string | null) | null = null;

export function initAuthInterceptor(fn: () => string | null) {
  getToken = fn;
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken?.();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
