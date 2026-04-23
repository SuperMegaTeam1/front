// TODO(auth): перейти на HttpOnly cookies — см. wiki/concepts/auth-strategy.md
// После готовности бэка:
//   - добавить сюда { withCredentials: true }
//   - удалить request-интерсептор с Authorization: Bearer
//   - кука будет ехать автоматически

import axios from 'axios';
import { useAuthStore } from '@/stores/useAuthStore';

/**
 * Настроенный Axios-инстанс для всех запросов к бэкенду.
 *
 * - Базовый URL берётся из переменной окружения NEXT_PUBLIC_API_URL
 * - Перед каждым запросом автоматически добавляется JWT-токен
 * - При 401-ошибке пользователь разлогинивается
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Интерцептор запросов: прикрепление JWT-токена ---
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

// --- Интерцептор ответов: обработка ошибок авторизации ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен истёк или невалиден — выходим
      useAuthStore.getState().logout();

      // Редирект на страницу логина (только на клиенте)
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
