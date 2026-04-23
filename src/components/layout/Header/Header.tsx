'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, Badge } from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import styles from './Header.module.scss';

export function Header() {
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const pathname = usePathname();

  const isTeacher = user?.role === 'teacher';
  const schedulePath = isTeacher ? '/teacher/schedule' : '/student/schedule';
  const calendarPath = schedulePath;
  const secondaryPath = isTeacher ? '/teacher/subjects' : '/student/rating';
  const notificationsPath = isTeacher ? '/teacher/notifications' : '/student/notifications';
  const profilePath = isTeacher ? '/teacher/profile' : '/student/profile';
  const avatarLabel = user
    ? `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.trim()
    : 'МИ';
  const isHomePage = pathname === schedulePath;

  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        <Link href={schedulePath} className={styles.logo}>
          Мой ИВМиИТ
        </Link>

        <nav className={styles.nav}>
          <Link
            href={schedulePath}
            className={`${styles.homeLink} ${isHomePage ? styles.homeLinkActive : ''}`}
            aria-current={isHomePage ? 'page' : undefined}
          >
            <HomeRoundedIcon sx={{ fontSize: 24 }} />
            Главная
          </Link>

          <Link href={calendarPath} className={styles.navIconLink} aria-label="Календарь">
            <CalendarMonthOutlinedIcon sx={{ fontSize: 28 }} />
          </Link>

          <Link
            href={secondaryPath}
            className={styles.navIconLink}
            aria-label={isTeacher ? 'Предметы' : 'Рейтинг'}
          >
            {isTeacher ? (
              <DescriptionOutlinedIcon sx={{ fontSize: 28 }} />
            ) : (
              <BarChartRoundedIcon sx={{ fontSize: 28 }} />
            )}
          </Link>
        </nav>

        <div className={styles.actions}>
          <button type="button" className={styles.actionButton} aria-label="Сменить тему">
            <DarkModeOutlinedIcon sx={{ fontSize: 28 }} />
          </button>

          {isTeacher ? (
            <Link href={profilePath} className={styles.actionButton} aria-label="Редактировать профиль">
              <EditOutlinedIcon sx={{ fontSize: 28 }} />
            </Link>
          ) : (
            <Link href={notificationsPath} className={styles.actionButton} aria-label="Уведомления">
              <Badge
                badgeContent={unreadCount || null}
                color="error"
                sx={{ '& .MuiBadge-badge': { fontSize: '10px', minWidth: '16px', height: '16px' } }}
              >
                <NotificationsNoneOutlinedIcon sx={{ fontSize: 28 }} />
              </Badge>
            </Link>
          )}

          <Avatar
            component={Link}
            href={profilePath}
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
