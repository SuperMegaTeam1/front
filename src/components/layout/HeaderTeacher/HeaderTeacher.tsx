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
import { HeaderTeacherMobile } from './HeaderTeacherMobile';
import styles from './HeaderTeacher.module.scss';

const HOME_PATH = '/teacher/home';
const SCHEDULE_PATH = '/teacher/schedule';
const SUBJECTS_PATH = '/teacher/subjects';
const MESSAGES_PATH = '/teacher/messages';
const PROFILE_PATH = '/teacher/profile';

export function HeaderTeacher() {
  const { user } = useAuthStore();
  const pathname = usePathname();

  const avatarLabel = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.trim()
    : 'МИ';
  const isHomePage = pathname === HOME_PATH;
  const isSchedulePage = pathname === SCHEDULE_PATH || pathname.startsWith('/teacher/lesson/');
  const isSubjectsPage = pathname === SUBJECTS_PATH || pathname.startsWith(`${SUBJECTS_PATH}/`);
  const isMessagesPage = pathname === MESSAGES_PATH;
  const isProfilePage = pathname === PROFILE_PATH;

  return (
    <>
      <header className={styles.root}>
        <div className={styles.inner}>
          <Link href={HOME_PATH} className={styles.logo}>
            Мой ИВМиИТ
          </Link>

          <nav className={styles.nav} aria-label="Основная навигация преподавателя">
            <Link
              href={HOME_PATH}
              className={`${styles.navIconLink} ${isHomePage ? `${styles.navIconLinkActive} ${styles.navIconLinkHomeActive}` : ''}`}
              aria-label="Главная"
              aria-current={isHomePage ? 'page' : undefined}
            >
              <HomeRoundedIcon sx={{ fontSize: 28 }} />
              {isHomePage && <span className={styles.navText}>Главная</span>}
            </Link>

            <Link
              href={SCHEDULE_PATH}
              className={`${styles.navIconLink} ${isSchedulePage ? `${styles.navIconLinkActive} ${styles.navIconLinkHomeActive}` : ''}`}
              aria-label="Расписание"
              aria-current={isSchedulePage ? 'page' : undefined}
            >
              <CalendarMonthOutlinedIcon sx={{ fontSize: 28 }} />
              {isSchedulePage && <span className={styles.navText}>Расписание</span>}
            </Link>

            <Link
              href={SUBJECTS_PATH}
              className={`${styles.navIconLink} ${isSubjectsPage ? `${styles.navIconLinkActive} ${styles.navIconLinkHomeActive}` : ''}`}
              aria-label="Предметы"
              aria-current={isSubjectsPage ? 'page' : undefined}
            >
              <ArticleOutlinedIcon sx={{ fontSize: 28 }} />
              {isSubjectsPage && <span className={styles.navText}>Предметы</span>}
            </Link>
          </nav>

          <div className={styles.actions}>
            <button type="button" className={styles.actionButton} aria-label="Сменить тему">
              <DarkModeOutlinedIcon sx={{ fontSize: 28 }} />
            </button>

            <Link
              href={MESSAGES_PATH}
              className={`${styles.actionButton} ${isMessagesPage ? `${styles.actionButtonActive} ${styles.navIconLinkHomeActive}` : ''}`}
              aria-label="Сообщения"
              aria-current={isMessagesPage ? 'page' : undefined}
            >
              <EditOutlinedIcon sx={{ fontSize: 28 }} />
              {isMessagesPage && <span className={styles.navText}>Отправить</span>}
            </Link>

            <Avatar
              component={Link}
              href={PROFILE_PATH}
              variant="rounded"
              className={`${styles.profileAvatar} ${isProfilePage ? styles.profileAvatarActive : ''}`}
              sx={{
                bgcolor: '#201b2d',
                width: 62,
                height: 62,
                fontSize: '20px',
                fontWeight: 700,
                cursor: 'pointer',
                textDecoration: 'none',
                borderRadius: '14px',
              }}
              aria-current={isProfilePage ? 'page' : undefined}
            >
              {avatarLabel}
            </Avatar>
          </div>
        </div>
      </header>

      <HeaderTeacherMobile />
    </>
  );
}
