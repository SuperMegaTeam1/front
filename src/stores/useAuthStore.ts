// TODO(auth): перейти на HttpOnly cookies - см. wiki/concepts/auth-strategy.md
// Сейчас токен хранится в localStorage (persist), это уязвимо к XSS.
// Решение: бэк ставит куку Set-Cookie: HttpOnly; Secure; SameSite=Lax,
// а этот стор хранит только user (без accessToken/refreshToken и без persist).
// Ждём реализации /auth/login на бэке.

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role } from '@/types/user';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
  getRole: () => Role | null;
  setHasHydrated: (isHydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      hasHydrated: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({ user, accessToken, refreshToken, isAuthenticated: true }),

      logout: () =>
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),

      setAccessToken: (token) =>
        set({ accessToken: token }),

      getRole: () => get().user?.role ?? null,

      setHasHydrated: (isHydrated) =>
        set({ hasHydrated: isHydrated }),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
