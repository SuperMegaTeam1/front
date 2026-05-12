'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import { PageHero } from '@/components/ui';
import { useAuthStore } from '@/stores/useAuthStore';
import { formatDateFull, getWeekDay } from '@/lib/utils/formatDate';
import styles from './home.module.scss';
import { TeacherHomeScheduleSection } from './components/TeacherHomeScheduleSection';
import { TeacherHomeSubjectsSection } from './components/TeacherHomeSubjectsSection';
import type { TeacherHomeDay, TeacherHomeSubject } from './components/TeacherHome.types';

const MOCK_DAYS: TeacherHomeDay[] = [
  {
    label: 'Вчера',
    date: '2026-04-22',
    lessons: [
      {
        id: 1,
        startTime: '08:30',
        endTime: '10:00',
        subjectName: 'Базы данных',
        meta: 'Лекция • 09-351, 09-352.',
        room: 'Ауд. 1005',
      },
      {
        id: 2,
        startTime: '10:15',
        endTime: '11:45',
        subjectName: 'Дискретная математика',
        meta: 'Практика • 09-234.',
        room: 'Ауд. 602',
      },
    ],
  },
  {
    label: 'Сегодня',
    date: '2026-04-23',
    lessons: [
      {
        id: 3,
        startTime: '10:20',
        endTime: '11:50',
        subjectName: 'Базы данных',
        meta: 'Лекция • 09-352, 09-353.',
        room: 'Ауд. 1101',
        isActive: true,
      },
      {
        id: 4,
        startTime: '12:10',
        endTime: '13:40',
        subjectName: 'Дискретная математика',
        meta: 'Практика • 09-234.',
        room: 'Ауд. 602',
      },
      {
        id: 5,
        startTime: '14:00',
        endTime: '15:30',
        subjectName: 'Программная инженерия',
        meta: 'Практика • 08-222.',
        room: 'Ауд. 310',
      },
    ],
  },
  {
    label: 'Завтра',
    date: '2026-04-24',
    lessons: [
      {
        id: 6,
        startTime: '10:20',
        endTime: '11:50',
        subjectName: 'Базы данных',
        meta: 'Лекция • 09-352, 09-353.',
        room: 'Ауд. 1101',
      },
      {
        id: 7,
        startTime: '12:10',
        endTime: '13:40',
        subjectName: 'Практикум',
        meta: 'Группа • 09-251.',
        room: 'Ауд. 518',
      },
    ],
  },
];

const MOCK_SUBJECTS: TeacherHomeSubject[] = [
  {
    id: 1,
    name: 'Математический анализ',
    examType: 'ЭКЗАМЕН',
    groups: ['09-351', '09-352'],
    icon: <CalculateOutlinedIcon sx={{ fontSize: 34, color: '#2a657e' }} />,
    iconVariant: 'brand',
  },
  {
    id: 2,
    name: 'Дискретная математика',
    examType: 'ЗАЧЕТ',
    groups: ['09-251', '09-252'],
    icon: <HubOutlinedIcon sx={{ fontSize: 34, color: '#2a657e' }} />,
    iconVariant: 'violet',
  },
  {
    id: 3,
    name: 'Программная инженерия',
    examType: 'ЭКЗАМЕН',
    groups: ['09-351'],
    icon: <CodeOutlinedIcon sx={{ fontSize: 34, color: '#2a657e' }} />,
    iconVariant: 'mint',
  },
];

export default function TeacherSchedulePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const previousDay = MOCK_DAYS[0];
  const today = MOCK_DAYS[1];
  const nextDay = MOCK_DAYS[2];
  const todayLessonsCount = today.lessons.length;
  const todayDateStr = formatDateFull(today.date);
  const todayWeekDay = getWeekDay(today.date);
  const firstName = user?.firstName ?? 'Дмитрий';
  const patronymic = user?.patronymic ?? 'Александрович';
  const fullGreeting = `${firstName} ${patronymic}`.trim();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero
          className={styles.homeHero}
          title={`Добрый день, ${fullGreeting}`}
          meta={
            <>
              <span className={styles.heroMetaItem}>{todayWeekDay}, {todayDateStr}</span>
              <span className={styles.heroMetaDot}>·</span>
              <span className={styles.heroMetaItem}>Неделя 10</span>
              <span className={styles.heroMetaDot}>·</span>
              <strong className={styles.heroMetaStrong}>{todayLessonsCount} занятия сегодня</strong>
            </>
          }
          action={
            <Link href="#schedule" className={styles.greetingLink}>
              Перейти в расписание <ArrowForwardIcon sx={{ fontSize: 22 }} />
            </Link>
          }
        />

        <TeacherHomeScheduleSection
          previousDay={previousDay}
          currentDay={today}
          nextDay={nextDay}
          onLessonOpen={(lessonId) => router.push(`/teacher/lesson/${lessonId}`)}
        />

        <TeacherHomeSubjectsSection subjects={MOCK_SUBJECTS} />
      </div>
    </div>
  );
}
