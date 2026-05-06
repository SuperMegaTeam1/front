'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getRoleFromToken, getStudentMe, getTeacherMe, login as loginApi } from '@/lib/api/auth.api';
import { mapStudentMeToUser, mapTeacherMeToUser } from '@/lib/api/types';
import { useAuthStore } from '@/stores/useAuthStore';
import type { LoginPayload } from '@/types/api';

export function useAuth() {
  const router = useRouter();
  const { setAuth, logout: clearAuth, user, isAuthenticated } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const loginResponse = await loginApi(payload);
      const accessToken = loginResponse.data.token;
      const role = getRoleFromToken(accessToken);
      if (!role) {
        throw new Error('Unable to determine role from access token');
      }

      const user =
        role === 'student'
          ? mapStudentMeToUser((await getStudentMe(accessToken)).data)
          : mapTeacherMeToUser((await getTeacherMe(accessToken)).data);

      return {
        accessToken,
        user,
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
    login: loginMutation.mutateAsync,
    logout,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
  };
}
