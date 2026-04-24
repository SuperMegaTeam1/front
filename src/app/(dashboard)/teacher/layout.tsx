import { HeaderTeacher } from '@/components/layout/HeaderTeacher/HeaderTeacher';
import { Footer } from '@/components/layout/Footer/Footer';
import styles from '../dashboard.module.scss';

export default function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderTeacher />
      <main className={styles.main}>{children}</main>
      <Footer />
    </>
  );
}
