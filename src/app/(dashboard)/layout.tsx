import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer/Footer';
import styles from './dashboard.module.scss';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.root}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
}
