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
import styles from './HeaderTeacherMobile.module.scss';

const HOME_PATH = '/teacher/home';
const SCHEDULE_PATH = '/teacher/schedule';
const SUBJECTS_PATH = '/teacher/subjects';
const MESSAGES_PATH = '/teacher/messages';
const PROFILE_PATH = '/teacher/profile';

export function HeaderTeacherMobile() {
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
      <header className={styles.topBar}>
        <Link href={HOME_PATH} className={styles.logo}>
          Мой
          <span>ИВМиИТ</span>
        </Link>

        <div className={styles.actions}>
          <button type="button" className={styles.actionButton} aria-label="Сменить тему">
            <DarkModeOutlinedIcon sx={{ fontSize: 21 }} />
          </button>

          <Link
            href={MESSAGES_PATH}
            className={`${styles.actionButton} ${isMessagesPage ? styles.actionButtonActive : ''}`}
            aria-label="Сообщения"
            aria-current={isMessagesPage ? 'page' : undefined}
          >
            <EditOutlinedIcon sx={{ fontSize: 21 }} />
          </Link>

          <Avatar
            component={Link}
            href={PROFILE_PATH}
            variant="rounded"
            className={`${styles.profileAvatar} ${isProfilePage ? styles.profileAvatarActive : ''}`}
            sx={{
              bgcolor: '#201b2d',
              width: 36,
              height: 44,
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              textDecoration: 'none',
              borderRadius: '7px',
            }}
            aria-current={isProfilePage ? 'page' : undefined}
          >
            {avatarLabel}
          </Avatar>
        </div>
      </header>

      <nav className={styles.bottomNav} aria-label="Мобильная навигация преподавателя">
        <Link
          href={HOME_PATH}
          className={`${styles.bottomLink} ${isHomePage ? styles.bottomLinkActive : ''}`}
          aria-current={isHomePage ? 'page' : undefined}
        >
          <HomeRoundedIcon sx={{ fontSize: 21 }} />
          <span>Главная</span>
        </Link>

        <Link
          href={SCHEDULE_PATH}
          className={`${styles.bottomLink} ${isSchedulePage ? styles.bottomLinkActive : ''}`}
          aria-current={isSchedulePage ? 'page' : undefined}
        >
          <CalendarMonthOutlinedIcon sx={{ fontSize: 21 }} />
          <span>Расписание</span>
        </Link>

        <Link
          href={SUBJECTS_PATH}
          className={`${styles.bottomLink} ${isSubjectsPage ? styles.bottomLinkActive : ''}`}
          aria-current={isSubjectsPage ? 'page' : undefined}
        >
          <ArticleOutlinedIcon sx={{ fontSize: 21 }} />
          <span>Предметы</span>
        </Link>
      </nav>
    </>
  );
}
