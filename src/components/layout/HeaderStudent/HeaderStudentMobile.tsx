'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, Badge } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { useUnreadCount } from '@/lib/hooks/useNotifications';
import { useAuthStore } from '@/stores/useAuthStore';
import styles from './HeaderStudentMobile.module.scss';

const HOME_PATH = '/student/home';
const SCHEDULE_PATH = '/student/schedule';
const RATING_PATH = '/student/rating';
const NOTIFICATIONS_PATH = '/student/notifications';
const PROFILE_PATH = '/student/profile';

export function HeaderStudentMobile() {
  const { user } = useAuthStore();
  const { data: unreadCount = 0 } = useUnreadCount();
  const pathname = usePathname();

  const avatarLabel = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.trim()
    : 'МИ';

  const isHomePage = pathname === HOME_PATH;
  const isSchedulePage = pathname === SCHEDULE_PATH;
  const isRatingPage = pathname === RATING_PATH;
  const isNotificationsPage = pathname === NOTIFICATIONS_PATH;
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
            href={NOTIFICATIONS_PATH}
            className={`${styles.actionButton} ${isNotificationsPage ? styles.actionButtonActive : ''}`}
            aria-label="Уведомления"
            aria-current={isNotificationsPage ? 'page' : undefined}
          >
            <Badge
              badgeContent={unreadCount || null}
              color="error"
              sx={{ '& .MuiBadge-badge': { fontSize: '8px', minWidth: '13px', height: '13px' } }}
            >
              <NotificationsNoneOutlinedIcon sx={{ fontSize: 21 }} />
            </Badge>
          </Link>

          <Avatar
            component={Link}
            href={PROFILE_PATH}
            variant="rounded"
            className={`${styles.profileAvatar} ${isProfilePage ? styles.profileAvatarActive : ''}`}
            sx={{
              bgcolor: '#201b2d',
              width: 28,
              height: 44,
              fontSize: '11px',
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

      <nav className={styles.bottomNav} aria-label="Мобильная навигация студента">
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
          href={RATING_PATH}
          className={`${styles.bottomLink} ${isRatingPage ? styles.bottomLinkActive : ''}`}
          aria-current={isRatingPage ? 'page' : undefined}
        >
          <BarChartRoundedIcon sx={{ fontSize: 21 }} />
          <span>Баллы</span>
        </Link>
      </nav>
    </>
  );
}
