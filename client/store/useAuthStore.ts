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
  login: (email: string, password: string) => Promise<AuthUser | null>;
  register: (name: string, email: string, password: string) => Promise<{ success: true; message: string }>;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get<{ data: AuthUser }>('/auth/me');
      const user = data?.data ?? data;
      set({ user, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      const { data } = await api.post<{ data: { user: AuthUser } }>('/auth/signin', {
        email,
        password,
      });
      const raw = data?.data?.user ?? (data as unknown as { user: AuthUser }).user;
      const user: AuthUser = {
        id: raw.id,
        email: raw.email,
        name: raw.name,
        role: raw.role as 'USER' | 'ADMIN',
      };
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
    } catch {
      return null;
    }
  },

  register: async (name: string, email: string, password: string) => {
    const { data } = await api.post<{ data?: { success: true; message: string }; success?: true; message?: string }>(
      '/auth/register',
      { name, email, password },
    );
    const payload = data?.data ?? data;
    return {
      success: true,
      message: payload?.message ?? 'Registration successful',
    };
  },

  setUser: (user) =>
    set({ user, isAuthenticated: !!user }),

  logout: async () => {
    try {
      await api.post('/auth/signout');
    } catch {}
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
