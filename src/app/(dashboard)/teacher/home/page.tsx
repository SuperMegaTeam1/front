'use client';

import { useMemo, useState } from 'react';
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
import { getIsoWeekNumber, getLocalIsoDate, getWeekStart, shiftIsoDate } from '@/lib/utils/isoDate';
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

function buildEmptyWeek(anchorDate: string): TeacherHomeDay[] {
  const monday = getWeekStart(anchorDate);

  return Array.from({ length: 6 }, (_, index) => {
    const date = shiftIsoDate(monday, index);
    return { label: getWeekDay(date), date, lessons: [] };
  });
}

function mapWeekSchedule(schedule?: WeekScheduleResult): TeacherHomeDay[] {
  return (schedule?.items ?? []).map((day) => ({
    label: getWeekDay(day.date),
    date: day.date,
    lessons: sortLessons(day.items).map(mapLessonToHomeLesson),
  }));
}

export default function TeacherHomePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
  const todayDate = getLocalIsoDate();

  const {
    data: weekSchedule,
    isLoading: isWeekScheduleLoading,
    error: weekScheduleError,
  } = useWeekSchedule(todayDate);

  const weekDays = useMemo(() => {
    const backendDays = mapWeekSchedule(weekSchedule);
    return backendDays.length > 0 ? backendDays : buildEmptyWeek(todayDate);
  }, [todayDate, weekSchedule]);

  const todayIndex = Math.max(0, weekDays.findIndex((day) => day.date === todayDate));
  const currentDayIndex = Math.min(
    selectedDayIndex ?? todayIndex,
    Math.max(weekDays.length - 1, 0)
  );
  const currentDay = weekDays[currentDayIndex];
  const previousDay = weekDays[currentDayIndex - 1];
  const nextDay = weekDays[currentDayIndex + 1];

  const currentDateStr = formatDateFull(currentDay.date);
  const currentWeekDay = getWeekDay(currentDay.date);
  const currentDayLabel =
    currentDayIndex === todayIndex
      ? 'Сегодня'
      : currentDayIndex === todayIndex - 1
        ? 'Вчера'
        : currentDayIndex === todayIndex + 1
          ? 'Завтра'
          : getWeekDay(currentDay.date);

  const weekNumber = getIsoWeekNumber(currentDay.date);
  const firstName = user?.firstName ?? '';
  const patronymic = user?.patronymic ?? '';
  const fullGreeting = `${firstName} ${patronymic}`.trim() || 'Преподаватель';

  const lessonsCountLabel = useMemo(() => {
    if (isWeekScheduleLoading) return 'загружаем расписание';
    if (weekScheduleError) return 'расписание недоступно';

    const count = currentDay.lessons.length;
    if (count === 1) return '1 занятие';
    if (count >= 2 && count <= 4) return `${count} занятия`;
    return `${count} занятий`;
  }, [currentDay.lessons.length, isWeekScheduleLoading, weekScheduleError]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero
          className={styles.homeHero}
          title={`Добрый день, ${fullGreeting}`}
          meta={
            <>
              <span className={styles.heroMetaItem}>{currentWeekDay}, {currentDateStr}</span>
              <span className={styles.heroMetaDot}>·</span>
              <span className={styles.heroMetaItem}>Неделя {weekNumber}</span>
              <span className={styles.heroMetaDot}>·</span>
              <strong className={styles.heroMetaStrong}>
                {lessonsCountLabel} {currentDayLabel.toLowerCase()}
              </strong>
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
          currentDay={currentDay}
          nextDay={nextDay}
          currentDayIndex={currentDayIndex}
          todayIndex={todayIndex}
          totalDays={weekDays.length}
          isLoading={isWeekScheduleLoading}
          hasError={Boolean(weekScheduleError)}
          onPrevious={() => {
            setSelectedDayIndex((index) => Math.max(0, (index ?? currentDayIndex) - 1));
          }}
          onNext={() => {
            setSelectedDayIndex((index) => Math.min(weekDays.length - 1, (index ?? currentDayIndex) + 1));
          }}
          onLessonOpen={(lessonId) => router.push(`/teacher/lesson/${lessonId}`)}
        />

        <TeacherHomeSubjectsSection subjects={MOCK_SUBJECTS} />
      </div>
    </div>
  );
}
