'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useAuthStore } from '@/stores/useAuthStore';
import styles from './HeaderTeacher.module.scss';

const HOME_PATH = '/teacher/schedule';
const SUBJECTS_PATH = '/teacher/subjects';
const PROFILE_PATH = '/teacher/profile';

export function HeaderTeacher() {
  const { user } = useAuthStore();
  const pathname = usePathname();

  const avatarLabel = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.trim()
    : 'МИ';
  const isHomePage = pathname === HOME_PATH;

  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        <Link href={HOME_PATH} className={styles.logo}>
          Мой ИВМиИТ
        </Link>

        <nav className={styles.nav}>
          <Link
            href={HOME_PATH}
            className={`${styles.homeLink} ${isHomePage ? styles.homeLinkActive : ''}`}
            aria-current={isHomePage ? 'page' : undefined}
          >
            <HomeRoundedIcon sx={{ fontSize: 24 }} />
            Главная
          </Link>

          <Link href={HOME_PATH} className={styles.navIconLink} aria-label="Расписание">
            <CalendarMonthOutlinedIcon sx={{ fontSize: 28 }} />
          </Link>

          <Link href={SUBJECTS_PATH} className={styles.navIconLink} aria-label="Мои предметы">
            <ArticleOutlinedIcon sx={{ fontSize: 28 }} />
          </Link>
        </nav>

        <div className={styles.actions}>
          <button type="button" className={styles.actionButton} aria-label="Сменить тему">
            <DarkModeOutlinedIcon sx={{ fontSize: 28 }} />
          </button>

          <Link href={PROFILE_PATH} className={styles.actionButton} aria-label="Редактировать профиль">
            <EditOutlinedIcon sx={{ fontSize: 28 }} />
          </Link>

          <Avatar
            component={Link}
            href={PROFILE_PATH}
            variant="rounded"
            className={styles.profileAvatar}
            sx={{
              bgcolor: '#2a657e',
              width: 52,
              height: 52,
              fontSize: '18px',
              fontWeight: 700,
              cursor: 'pointer',
              textDecoration: 'none',
              borderRadius: '14px',
            }}
          >
            {avatarLabel}
          </Avatar>
        </div>
      </div>
    </header>
  );
}
