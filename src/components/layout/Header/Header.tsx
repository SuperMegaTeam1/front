'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import styles from './Header.module.scss';

export function Header() {
  const pathname = usePathname();
  const role = useAuthStore((s) => s.user?.role);
  const base = role === 'teacher' ? '/teacher' : '/student';

  const isHome = pathname === `${base}/schedule`;

  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        {/* Logo */}
        <div className={styles.logo}>
          <Link href={`${base}/schedule`} className={styles.logoText}>
            Мой ИВМиИТ
          </Link>
        </div>

        {/* Nav */}
        <nav className={styles.nav}>
          <Link href={`${base}/schedule`} className={`${styles.navLink} ${isHome ? styles.navLinkActive : ''}`}>
            <HomeIcon sx={{ fontSize: 20 }} />
            <span>Главная</span>
          </Link>
          <Link href={`${base}/schedule`} className={styles.navIcon} aria-label="Расписание">
            <CalendarMonthOutlinedIcon sx={{ fontSize: 20 }} />
          </Link>
          <Link href={`${base}/materials`} className={styles.navIcon} aria-label="Материалы">
            <FileCopyOutlinedIcon sx={{ fontSize: 20 }} />
          </Link>
        </nav>

        {/* Right actions */}
        <div className={styles.actions}>
          <button type="button" className={styles.actionBtn} aria-label="Тема">
            <DarkModeOutlinedIcon sx={{ fontSize: 22 }} />
          </button>
          <button type="button" className={styles.actionBtn} aria-label="Настройки">
            <EditOutlinedIcon sx={{ fontSize: 22 }} />
          </button>
          <Link href={`${base}/profile`} className={styles.avatar}>
            <img src="https://i.pravatar.cc/150?img=47" alt="Avatar" width={40} height={40} className={styles.avatarImage} />
          </Link>
        </div>
      </div>
    </header>
  );
}
