import axios, { type AxiosError } from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const origin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/?$/, '');
// NEXT_PUBLIC_API_URL may already include /api/v1 (e.g. http://localhost:5000/api/v1) — do not append again
const baseURL = origin.includes('/api/v1') ? origin : `${origin}/api/v1`;
const AUTH_STORAGE_KEY = 'auth-storage';

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const UNAUTHORIZED_EXCLUDED_PATHS = ['/auth/me', '/auth/signin', '/auth/register', '/auth/signout'];

let isRedirectingAfterUnauthorized = false;

function getStoredToken(): string | null {
  const { token } = useAuthStore.getState();
  if (token) return token;

  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as { state?: { token?: string | null } };
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  config.withCredentials = true;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url ?? '';
    const isExcludedPath = UNAUTHORIZED_EXCLUDED_PATHS.some((path) => requestUrl.includes(path));

    const hadToken = !!getStoredToken();

    if (status === 401 && !isExcludedPath && !isRedirectingAfterUnauthorized && hadToken) {
      isRedirectingAfterUnauthorized = true;
      await useAuthStore.getState().logout({ skipRequest: true });

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(AUTH_STORAGE_KEY);

        try {
          await axios.post(
            `${baseURL}/auth/signout`,
            {},
            {
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
        } catch {}

        if (window.location.pathname !== '/sign-in') {
          window.location.href = '/sign-in';
        } else {
          isRedirectingAfterUnauthorized = false;
        }
      }
    }

    return Promise.reject(error);
  },
);
