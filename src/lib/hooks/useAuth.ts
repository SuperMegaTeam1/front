'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { login as loginApi, logout as logoutApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/stores/useAuthStore';
import type { LoginPayload } from '@/types/api';

/** Хук авторизации: login, logout */
export function useAuth() {
  const router = useRouter();
  const { setAuth, logout: clearAuth, user, isAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => loginApi(payload),
    onSuccess: (response) => {
      const { user, accessToken, refreshToken } = response.data.data;
      setAuth(user, accessToken, refreshToken);

      // Редирект по роли
      if (user.role === 'student') {
        router.push('/student/schedule');
      } else {
        router.push('/teacher/schedule');
      }
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => logoutApi(),
    onSettled: () => {
      clearAuth();
      router.push('/login');
    },
  });

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
  };
}
