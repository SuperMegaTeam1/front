'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getRoleFromToken, getStudentMe, getTeacherMe } from '@/lib/api/auth.api';
import { mapStudentMeToUser, mapTeacherMeToUser } from '@/lib/api/types';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Role } from '@/types/user';

interface AuthGuardProps {
  allowedRole: Role;
  children: React.ReactNode;
}

function getHomePath(role: Role) {
  return role === 'student' ? '/student/home' : '/teacher/home';
}

export function AuthGuard({ allowedRole, children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, refreshToken, user, setAuth, logout } = useAuthStore();
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const persistApi = useAuthStore.persist;

    if (!persistApi) {
      queueMicrotask(() => setHasHydrated(true));
      return;
    }

    const unsubscribe = persistApi.onFinishHydration(() => {
      setHasHydrated(true);
    });

    if (persistApi.hasHydrated()) {
      queueMicrotask(() => setHasHydrated(true));
    }

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    let isMounted = true;

    async function checkAuth() {
      if (!accessToken) {
        logout();
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      try {
        const currentUser = user ?? (await (async () => {
          const role = getRoleFromToken(accessToken);
          if (!role) {
            throw new Error('Unable to determine role from access token');
          }

          return role === 'student'
            ? mapStudentMeToUser((await getStudentMe(accessToken)).data)
            : mapTeacherMeToUser((await getTeacherMe(accessToken)).data);
        })());

        if (!user) {
          setAuth(currentUser, accessToken, refreshToken ?? '');
        }

        if (currentUser.role !== allowedRole) {
          router.replace(getHomePath(currentUser.role));
          return;
        }

        if (isMounted) {
          setIsChecking(false);
        }
      } catch {
        logout();
        router.replace('/login');
      }
    }

    void checkAuth();

    return () => {
      isMounted = false;
    };
  }, [accessToken, allowedRole, hasHydrated, logout, pathname, refreshToken, router, setAuth, user]);

  if (!hasHydrated || isChecking || !accessToken || !user || user.role !== allowedRole) {
    return null;
  }

  return <>{children}</>;
}
