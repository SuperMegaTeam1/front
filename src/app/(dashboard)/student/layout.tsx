import { HeaderStudent } from '@/components/layout/HeaderStudent/HeaderStudent';
import { Footer } from '@/components/layout/Footer/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { StudentNotificationsBootstrap } from '@/components/notifications/StudentNotificationsBootstrap';
import styles from '../dashboard.module.scss';

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard allowedRole="student">
      <StudentNotificationsBootstrap />
      <HeaderStudent />
      <main className={`${styles.main} ${styles.studentMain}`}>{children}</main>
      <Footer />
      <div className={styles.studentMobileNavSpacer} aria-hidden="true" />
    </AuthGuard>
  );
}
