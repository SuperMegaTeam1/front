'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import { useNotificationsHub } from '@/lib/hooks/useNotificationsHub';
import styles from './dashboard.module.scss';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { hasHydrated } = useAuthStore();

  useNotificationsHub();

  if (!hasHydrated) {
    return null;
  }

  return <div className={styles.root}>{children}</div>;
}
