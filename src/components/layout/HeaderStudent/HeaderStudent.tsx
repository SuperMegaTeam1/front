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

          <Link href={RATING_PATH} className={styles.navIconLink} aria-label="Рейтинг">
            <BarChartRoundedIcon sx={{ fontSize: 28 }} />
          </Link>
        </nav>

        <div className={styles.actions}>
          <button type="button" className={styles.actionButton} aria-label="Сменить тему">
            <DarkModeOutlinedIcon sx={{ fontSize: 28 }} />
          </button>

          <Link href={NOTIFICATIONS_PATH} className={styles.actionButton} aria-label="Уведомления">
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
