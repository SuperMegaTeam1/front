import type { ReactNode } from 'react';
import CodeRoundedIcon from '@mui/icons-material/CodeRounded';
import FunctionsRoundedIcon from '@mui/icons-material/FunctionsRounded';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import type { ScheduleCardProps } from '@/components/ui';
import type { LessonCardProps } from '@/components/shared/LessonCard/LessonCard';
import type { RatingTableRow } from '@/components/shared/RatingTable/RatingTable';
import type { SubjectCardProps } from '@/components/shared/SubjectCard/SubjectCard';

export const mockScheduleCards: ScheduleCardProps[] = [
  {
    startTime: '08:30',
    endTime: '10:00',
    subjectName: 'Web-программирование',
    lessonType: 'Практика',
    room: 'Ауд. 1208',
    teacherName: 'Иванов Д. А.',
    moreLabel: 'Перейти к Web-программированию',
  },
];

export const mockLessonCards: LessonCardProps[] = [
  {
    startTime: '08:30',
    endTime: '10:00',
    subjectName: 'Web-программирование',
    lessonType: 'Практика',
    groups: ['09-352'],
    room: '1208',
    isActive: true,
  },
  {
    startTime: '10:10',
    endTime: '11:40',
    subjectName: 'Базы данных',
    lessonType: 'Лекция',
    groups: ['09-352'],
    room: '1502',
  },
];

export const mockRatingRows: RatingTableRow[] = [
  {
    position: 1,
    studentName: 'Сабиров Тимур Ильдарович',
    score: 94.6,
    avatarLabel: 'СТ',
    avatarColor: '#2a657e',
  },
  {
    position: 2,
    studentName: 'Кузнецова Алина Павловна',
    score: 91.2,
    avatarLabel: 'КА',
    avatarColor: '#7c4dff',
  },
  {
    position: 3,
    studentName: 'Морозова Глория Андреевна',
    score: 88.5,
    avatarLabel: 'МГ',
    avatarColor: '#2e7d32',
  },
  {
    position: 4,
    studentName: 'Васильев Дмитрий Сергеевич',
    score: 84.8,
    avatarLabel: 'ВД',
    avatarColor: '#0288d1',
  },
];

export const mockSubjects: SubjectCardProps[] = [
  {
    id: 'web',
    name: 'Web-программирование',
    groups: ['09-352', '09-353'],
    href: '/teacher/subjects',
    icon: <CodeRoundedIcon sx={{ fontSize: 30, color: 'var(--color-brand)' }} />,
    iconVariant: 'brand',
  },
  {
    id: 'math',
    name: 'Математический анализ',
    groups: ['09-351'],
    href: '/teacher/subjects',
    icon: <FunctionsRoundedIcon sx={{ fontSize: 30, color: 'var(--color-secondary)' }} />,
    iconVariant: 'violet',
  },
  {
    id: 'practice',
    name: 'Проектный практикум',
    groups: ['09-352'],
    href: '/teacher/subjects',
    icon: <SchoolOutlinedIcon sx={{ fontSize: 30, color: 'var(--color-success)' }} />,
    iconVariant: 'mint',
  },
];

export const mockNotificationIcon: ReactNode = (
  <NotificationsNoneOutlinedIcon sx={{ fontSize: 24, color: 'var(--color-brand)' }} />
);

export const mockInfoIcons = {
  school: <SchoolOutlinedIcon sx={{ fontSize: 22 }} />,
};
