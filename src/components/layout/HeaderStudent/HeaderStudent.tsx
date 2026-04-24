'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, Badge } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import styles from './HeaderStudent.module.scss';

const HOME_PATH = '/student/schedule';
const SUBJECTS_PATH = '/student/subjects';
const RATING_PATH = '/student/rating';
const NOTIFICATIONS_PATH = '/student/notifications';
const PROFILE_PATH = '/student/profile';

export function HeaderStudent() {
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const pathname = usePathname();

  const avatarLabel = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.trim()
    : 'МИ';
  const isHomePage = pathname === HOME_PATH;
  const isSubjectsPage = pathname === SUBJECTS_PATH || pathname.startsWith(`${SUBJECTS_PATH}/`);
  const isRatingPage = pathname === RATING_PATH;
  const isNotificationsPage = pathname === NOTIFICATIONS_PATH;
  const isProfilePage = pathname === PROFILE_PATH;

  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        <Link href={HOME_PATH} className={styles.logo}>
          Мой ИВМиИТ
        </Link>

        <nav className={styles.nav} aria-label="Основная навигация студента">
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
            href={SUBJECTS_PATH}
            className={`${styles.navIconLink} ${isSubjectsPage ? styles.navIconLinkActive : ''}`}
            aria-label="Предметы"
            aria-current={isSubjectsPage ? 'page' : undefined}
          >
            <CalendarMonthOutlinedIcon sx={{ fontSize: 28 }} />
          </Link>

          <Link
            href={RATING_PATH}
            className={`${styles.navIconLink} ${isRatingPage ? styles.navIconLinkActive : ''}`}
            aria-label="Рейтинг"
            aria-current={isRatingPage ? 'page' : undefined}
          >
            <BarChartRoundedIcon sx={{ fontSize: 28 }} />
          </Link>
        </nav>

        <div className={styles.actions}>
          <button type="button" className={styles.actionButton} aria-label="Сменить тему">
            <DarkModeOutlinedIcon sx={{ fontSize: 28 }} />
          </button>

          <Link
            href={NOTIFICATIONS_PATH}
            className={`${styles.actionButton} ${isNotificationsPage ? styles.actionButtonActive : ''}`}
            aria-label="Уведомления"
            aria-current={isNotificationsPage ? 'page' : undefined}
          >
            <Badge
              badgeContent={unreadCount || null}
              color="error"
              sx={{ '& .MuiBadge-badge': { fontSize: '10px', minWidth: '16px', height: '16px' } }}
            >
              <NotificationsNoneOutlinedIcon sx={{ fontSize: 28 }} />
            </Badge>
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
  );
}
