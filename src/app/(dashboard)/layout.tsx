'use client';

import { useAuthStore } from '@/stores/useAuthStore';
import styles from './dashboard.module.scss';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { hasHydrated } = useAuthStore();

  if (!hasHydrated) {
    return null;
  }

  return <div className={styles.root}>{children}</div>;
}
