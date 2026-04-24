import styles from './dashboard.module.scss';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Header и main кладёт в per-role layout (teacher/layout.tsx, student/layout.tsx).
  // Footer пока общий — подключается здесь же в конце.
  return <div className={styles.root}>{children}</div>;
}
