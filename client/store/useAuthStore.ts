import { create } from 'zustand';
import { api } from '@/lib/axios';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

const AUTH_STORAGE_KEY = 'auth-storage';

interface LogoutOptions {
  skipRequest?: boolean;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  register: (name: string, email: string, password: string) => Promise<{ success: true; message: string }>;
  clearAuth: () => void;
  setUser: (user: AuthUser | null) => void;
  logout: (options?: LogoutOptions) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get<{ data: AuthUser }>('/auth/me');
      const user = data?.data ?? data;
      set({ user, isAuthenticated: true });
    } catch {
      get().clearAuth();
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      const { data } = await api.post<{ data?: { user: AuthUser; accessToken?: string }; user?: AuthUser; accessToken?: string }>(
        '/auth/signin',
        {
          email,
          password,
        },
        { withCredentials: true },
      );
      const payload = data?.data ?? data;
      const raw = payload?.user;
      if (!raw) {
        get().clearAuth();
        return null;
      }
      const user: AuthUser = {
        id: raw.id,
        email: raw.email,
        name: raw.name,
        role: raw.role as 'USER' | 'ADMIN',
      };
      set({
        user,
        token: payload?.accessToken ?? null,
        isAuthenticated: true,
        isLoading: false,
      });
      return user;
    } catch {
      get().clearAuth();
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

  clearAuth: () =>
    set(() => {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);
      }

      return { user: null, token: null, isAuthenticated: false, isLoading: false };
    }),

  setUser: (user) =>
    set((state) => ({ user, token: user ? state.token : null, isAuthenticated: !!user, isLoading: false })),

  logout: async (options) => {
    try {
      if (!options?.skipRequest) {
        await api.post('/auth/signout');
      }
    } catch {}
    get().clearAuth();
  },
}));
