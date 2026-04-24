// TODO(auth): перейти на HttpOnly cookies — см. wiki/concepts/auth-strategy.md
// Сейчас токен хранится в localStorage (persist), это уязвимо к XSS.
// Решение: бэк ставит куку Set-Cookie: HttpOnly; Secure; SameSite=Lax,
// а этот стор хранит ТОЛЬКО user (без accessToken/refreshToken и без persist).
// Ждём реализации /auth/login на бэке.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role } from '@/types/user';

interface AuthState {
  /** Текущий пользователь */
  user: User | null;
  /** JWT токен доступа */
  accessToken: string | null;
  /** Refresh-токен */
  refreshToken: string | null;
  /** Авторизован ли пользователь */
  isAuthenticated: boolean;

  /** Сохранить данные после логина */
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  /** Очистить данные (выход) */
  logout: () => void;
  /** Обновить токен */
  setAccessToken: (token: string) => void;
  /** Получить роль текущего пользователя */
  getRole: () => Role | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),

      setAccessToken: (token) =>
        set({ accessToken: token }),

      getRole: () => get().user?.role ?? null,
    }),
    {
      name: 'auth-storage', // ключ в localStorage
    }
  )
);
