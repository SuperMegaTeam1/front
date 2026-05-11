'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import { PageHero } from '@/components/ui';
import { useAuthStore } from '@/stores/useAuthStore';
import { useWeekSchedule } from '@/lib/hooks/useSchedule';
import type { ScheduleLessonResult, WeekScheduleResult } from '@/lib/api/types';
import { formatDateFull, getWeekDay } from '@/lib/utils/formatDate';
import { getIsoWeekNumber, getLocalIsoDate, shiftIsoDate } from '@/lib/utils/isoDate';
import styles from './home.module.scss';
import { TeacherHomeScheduleSection } from './components/TeacherHomeScheduleSection';
import { TeacherHomeSubjectsSection } from './components/TeacherHomeSubjectsSection';
import type { TeacherHomeDay, TeacherHomeLesson, TeacherHomeSubject } from './components/TeacherHome.types';

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

function sortLessons(lessons: ScheduleLessonResult[] | null | undefined) {
  return (lessons ?? []).slice().sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

function mapLessonToHomeLesson(lesson: ScheduleLessonResult): TeacherHomeLesson {
  const meta = [lesson.type, lesson.groupName].filter(Boolean).join(' • ');

  return {
    id: lesson.lessonsId,
    startTime: lesson.startsAt,
    endTime: lesson.endsAt,
    subjectName: lesson.subjectName,
    meta: meta || undefined,
    room: lesson.cabinet ? `Ауд. ${lesson.cabinet}` : undefined,
  };
}

function buildDay(label: string, date: string, lessons: ScheduleLessonResult[]): TeacherHomeDay {
  return {
    label,
    date,
    lessons: sortLessons(lessons).map(mapLessonToHomeLesson),
  };
}

function findDayInWeek(schedule: WeekScheduleResult | undefined, isoDate: string) {
  return schedule?.items?.find((day) => day.date === isoDate);
}

export default function TeacherHomePage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const todayDate = getLocalIsoDate();
  const yesterdayDate = shiftIsoDate(todayDate, -1);
  const tomorrowDate = shiftIsoDate(todayDate, 1);

  const { data: weekSchedule } = useWeekSchedule(todayDate);
  const { data: nextWeekSchedule } = useWeekSchedule(tomorrowDate, true);

  const previousDay = useMemo<TeacherHomeDay>(() => {
    const day = findDayInWeek(weekSchedule, yesterdayDate);
    return buildDay('Вчера', yesterdayDate, day?.items ?? []);
  }, [weekSchedule, yesterdayDate]);

  const today = useMemo<TeacherHomeDay>(() => {
    const day = findDayInWeek(weekSchedule, todayDate);
    return buildDay('Сегодня', todayDate, day?.items ?? []);
  }, [weekSchedule, todayDate]);

  const nextDay = useMemo<TeacherHomeDay>(() => {
    const day = findDayInWeek(weekSchedule, tomorrowDate) ?? findDayInWeek(nextWeekSchedule, tomorrowDate);
    return buildDay('Завтра', tomorrowDate, day?.items ?? []);
  }, [weekSchedule, nextWeekSchedule, tomorrowDate]);

  const todayLessonsCount = today.lessons.length;
  const todayDateStr = formatDateFull(today.date);
  const todayWeekDay = getWeekDay(today.date);
  const weekNumber = getIsoWeekNumber(todayDate);
  const firstName = user?.firstName ?? '';
  const patronymic = user?.patronymic ?? '';
  const fullGreeting = `${firstName} ${patronymic}`.trim() || 'Преподаватель';

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
              <span className={styles.heroMetaItem}>Неделя {weekNumber}</span>
              <span className={styles.heroMetaDot}>·</span>
              <strong className={styles.heroMetaStrong}>{todayLessonsCount} занятий сегодня</strong>
            </>
          }
          action={
            <Link href="/teacher/schedule" className={styles.greetingLink}>
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
