'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import styles from './dashboard.module.scss';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated || isAuthenticated) {
      return;
    }

    const next = pathname ? `?next=${encodeURIComponent(pathname)}` : '';
    router.replace(`/login${next}`);
  }, [hasHydrated, isAuthenticated, pathname, router]);

  if (!hasHydrated || !isAuthenticated) {
    return null;
  }

  return <div className={styles.root}>{children}</div>;
}
