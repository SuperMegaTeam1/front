import { HeaderStudent } from '@/components/layout/HeaderStudent/HeaderStudent';
import { Footer } from '@/components/layout/Footer/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import styles from '../dashboard.module.scss';

export default function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard allowedRole="student">
      <HeaderStudent />
      <main className={styles.main}>{children}</main>
      <Footer />
    </AuthGuard>
  );
}
