import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/auth';
import { profileApi } from '../api/profile';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  phone: string | null;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<AuthUser, 'name' | 'phone' | 'avatar'>>) => Promise<void>;
  isLoggedIn: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      login: async (email, password) => {
        const res = await authApi.login(email, password);
        set({ token: res.accessToken, user: res.user });
      },

      register: async (name, email, password, phone) => {
        await authApi.register({ name, email, password, phone });
      },

      logout: () => {
        authApi.logout().catch(() => {});
        set({ token: null, user: null });
      },

      updateProfile: async (data) => {
        const res = await profileApi.update(data);
        set({
          user: {
            id: res.id,
            name: res.name,
            email: res.email,
            avatar: res.avatar,
            phone: res.phone,
          },
        });
      },

      isLoggedIn: () => get().user !== null && get().token !== null,
    }),
    { name: 'auth-storage' }
  )
);
