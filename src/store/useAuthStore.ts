import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Api } from '../api';

interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  phone: string | null;
  isAdmin: boolean;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<AuthUser, 'name' | 'phone' | 'avatar'>>) => Promise<void>;
  isLoggedIn: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      login: async (email, password) => {
        const res = await Api.auth.login(email, password);
        set({ token: res.accessToken, user: res.user });
      },

      register: async (name, email, password, phone) => {
        await Api.auth.register({ name, email, password, phone });
      },

      logout: () => {
        Api.auth.logout().catch(() => {});
        set({ token: null, user: null });
      },

      updateProfile: async (data) => {
        const res = await Api.profile.update(data);
        set({
          user: {
            id: res.id,
            name: res.name,
            email: res.email,
            avatar: res.avatar,
            phone: res.phone,
            isAdmin: res.isAdmin,
          },
        });
      },

      isLoggedIn: () => get().user !== null && get().token !== null,

      isAdmin: () => get().user?.isAdmin ?? false,
    }),
    { name: 'auth-storage' }
  )
);
