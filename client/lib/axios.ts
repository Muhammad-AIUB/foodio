import axios, { type AxiosError } from 'axios';
import { useAuthStore } from '@/store/useAuthStore';

const origin = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/?$/, '');
const baseURL = origin.includes('/api/v1') ? origin : `${origin}/api/v1`;

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AUTH_EXCLUDED_PATHS = ['/auth/signin', '/auth/register', '/auth/signout', '/auth/me'];

let isRedirecting = false;

api.interceptors.request.use((config) => {
  config.withCredentials = true;

  const { token } = useAuthStore.getState();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url ?? '';
    const isExcluded = AUTH_EXCLUDED_PATHS.some((p) => requestUrl.includes(p));

    if (status === 401 && !isExcluded && !isRedirecting) {
      isRedirecting = true;

      useAuthStore.getState().clearAuth();

      if (typeof window !== 'undefined' && window.location.pathname !== '/sign-in') {
        window.location.href = '/sign-in';
      } else {
        isRedirecting = false;
      }
    }

    return Promise.reject(error);
  },
);
