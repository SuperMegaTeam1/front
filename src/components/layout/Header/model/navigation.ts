import type { ElementType } from 'react';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LeaderboardRoundedIcon from '@mui/icons-material/LeaderboardRounded';

export type HeaderRole = 'student' | 'teacher';

export type HeaderNavItem = {
  href: string;
  label: string;
  icon: ElementType;
};

const studentNavItems: HeaderNavItem[] = [
  { href: '/student/home', label: 'Главная', icon: HomeRoundedIcon },
  { href: '/student/schedule', label: 'Расписание', icon: CalendarTodayRoundedIcon },
  { href: '/student/rating', label: 'Рейтинг', icon: LeaderboardRoundedIcon },
];

const teacherNavItems: HeaderNavItem[] = [
  { href: '/teacher/home', label: 'Главная', icon: HomeRoundedIcon },
  { href: '/teacher/schedule', label: 'Расписание', icon: CalendarTodayRoundedIcon },
];

export function getHeaderRole(pathname: string): HeaderRole {
  return pathname.startsWith('/teacher') ? 'teacher' : 'student';
}

export function getHeaderNavItems(role: HeaderRole) {
  return role === 'teacher' ? teacherNavItems : studentNavItems;
}

export function getProfileHref(role: HeaderRole) {
  return role === 'teacher' ? '/teacher/profile' : '/student/profile';
}

export function getHomeHref(role: HeaderRole) {
  return role === 'teacher' ? '/teacher/home' : '/student/home';
}

export function getNotificationsHref(role: HeaderRole) {
  return role === 'teacher' ? '/teacher/notifications' : '/student/notifications';
}

export function isActiveHeaderPath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}
