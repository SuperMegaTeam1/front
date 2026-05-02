import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

/**
 * Общий Axios-инстанс для текущего бэка.
 *
 * TODO(auth): перейти на HttpOnly cookies после готовности бэка.
 * Сейчас реальный контракт: POST /api/login возвращает JWT в JSON,
 * а защищенные запросы ждут Authorization: Bearer <token>.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? '/backend-api';

export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
