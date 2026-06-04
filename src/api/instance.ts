import { retrieveRawInitData } from '@telegram-apps/sdk';
import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { errorCodes } from './constants';

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

axiosInstance.interceptors.response.use(null, (error) => {
  if (error.status !== 401) return Promise.reject(error);
  useToastStore.getState().addToast('Попытка авторизации...');
  const initData = retrieveRawInitData();
  if (initData) {
    useAuthStore
      .getState()
      .telegramAuth(initData)
      .then(() => {
        useToastStore.getState().addToast('Всё хорошо');
      })
      .catch(() => {});
  }
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(null, (error) => {
  useToastStore.getState().addToast(errorCodes[error.status]);
  return Promise.reject(error);
});
