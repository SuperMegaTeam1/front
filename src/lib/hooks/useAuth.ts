'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getMe, login as loginApi } from '@/lib/api/auth.api';
import { mapAuthUserToUser } from '@/lib/api/types';
import { useAuthStore } from '@/stores/useAuthStore';
import type { LoginPayload } from '@/types/api';

export function useAuth() {
  const router = useRouter();
  const { setAuth, logout: clearAuth, user, isAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const loginResponse = await loginApi(payload);
      const accessToken = loginResponse.data.token;
      const meResponse = await getMe(accessToken);

      return {
        accessToken,
        user: mapAuthUserToUser(meResponse.data),
      };
    },
    onSuccess: ({ user, accessToken }) => {
      setAuth(user, accessToken, '');

      if (user.role === 'student') {
        router.push('/student/home');
      } else {
        router.push('/teacher/home');
      }
    },
  });

  const logout = () => {
    clearAuth();
    router.push('/login');
  };

  return {
    user,
    isAuthenticated,
    login: loginMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
  };
}
