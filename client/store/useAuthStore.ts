import { create } from 'zustand';
import { api } from '@/lib/axios';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get<{ data: AuthUser }>('/auth/me');
      const user = data?.data ?? data;
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) =>
    set({ user, isAuthenticated: !!user }),

  logout: async () => {
    try {
      await api.post('/auth/signout');
    } catch {}
    set({ user: null, isAuthenticated: false });
  },
}));
