import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Api } from '../api';

interface AuthUser {
  id: number;
  telegramId: number;
  telegramUsername: string | null;
  name: string;
  isAdmin: boolean;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  telegramAuth: (initDataRaw: string) => Promise<void>;
  isLoggedIn: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      telegramAuth: async (initDataRaw) => {
        const res = await Api.auth.telegramAuth(initDataRaw);
        set({ token: res.accessToken, user: res.user });
      },

      isLoggedIn: () => get().user !== null && get().token !== null,

      isAdmin: () => get().user?.isAdmin ?? false,
    }),
    { name: 'auth-storage' },
  ),
);
