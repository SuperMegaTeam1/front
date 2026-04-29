import { HeaderTeacher } from '@/components/layout/HeaderTeacher/HeaderTeacher';
import { Footer } from '@/components/layout/Footer/Footer';
import { AuthGuard } from '@/components/auth/AuthGuard';
import styles from '../dashboard.module.scss';

export default function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard allowedRole="teacher">
      <HeaderTeacher />
      <main className={styles.main}>{children}</main>
      <Footer />
    </AuthGuard>
  );
}
