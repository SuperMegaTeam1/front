'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddchartRoundedIcon from '@mui/icons-material/AddchartRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import { PageHero } from '@/components/ui';
import type { ScheduleLessonResult, WeekScheduleResult } from '@/lib/api/types';
import { useWeekSchedule } from '@/lib/hooks/useSchedule';
import { formatDateFull, getWeekDay } from '@/lib/utils/formatDate';
import { getIsoWeekNumber, getLocalIsoDate, getWeekStart, shiftIsoDate } from '@/lib/utils/isoDate';
import { useAuthStore } from '@/stores/useAuthStore';
import styles from './home.module.scss';
import { StudentHomeInsightsSection } from './components/StudentHomeInsightsSection';
import { StudentHomeRecentChangesSection } from './components/StudentHomeRecentChangesSection';
import {
  StudentHomeScheduleSection,
  type StudentHomeScheduleDay,
} from './components/StudentHomeScheduleSection';

type HomeLesson = StudentHomeScheduleDay['lessons'][number];
type HomeScheduleDay = StudentHomeScheduleDay;

const MOCK_GRADES = [
  { subject: 'Базы данных', score: 82 },
  { subject: 'Дискретная математика', score: 71 },
  { subject: 'Программная инженерия', score: 63 },
];

const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    icon: <AddchartRoundedIcon sx={{ fontSize: 28, color: '#2a657e' }} />,
    title: 'Добавлены баллы: +5 по Базам данных',
    subtitle: 'Раздел: практическая работа №4',
    time: '2 ч назад',
  },
  {
    id: 2,
    icon: <ApartmentRoundedIcon sx={{ fontSize: 28, color: '#2a657e' }} />,
    title: 'Изменена аудитория: Дискретная математика',
    subtitle: 'Новая локация: Ауд. 602 вместо 604',
    time: 'Вчера',
  },
  {
    id: 3,
    icon: <DescriptionRoundedIcon sx={{ fontSize: 28, color: '#2a657e' }} />,
    title: 'Опубликовано новое задание: Программная инженерия',
    subtitle: 'Срок сдачи: 16 апреля',
    time: 'Вчера',
  },
  {
    id: 4,
    icon: <VerifiedRoundedIcon sx={{ fontSize: 28, color: '#2a657e' }} />,
    title: 'Зачет подтвержден: Физкультура',
    subtitle: 'Преподаватель: Смирнов Д. А.',
    time: '2 дня назад',
  },
];

function buildEmptyWeek(anchorDate: string): HomeScheduleDay[] {
  const monday = getWeekStart(anchorDate);

  return Array.from({ length: 6 }, (_, index) => ({
    date: shiftIsoDate(monday, index),
    lessons: [],
  }));
}

function formatTeacherName(lesson: ScheduleLessonResult) {
  return [lesson.teacherLastName, lesson.teacherFirstName, lesson.teacherFatherName]
    .filter(Boolean)
    .join(' ');
}

function sortLessons(lessons: ScheduleLessonResult[] | null | undefined) {
  return (lessons ?? []).slice().sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

function mapLessonToHomeLesson(lesson: ScheduleLessonResult): HomeLesson {
  const teacherName = formatTeacherName(lesson);
  const meta = [lesson.type, teacherName].filter(Boolean).join(' • ');

  return {
    id: lesson.lessonsId,
    startTime: lesson.startsAt,
    endTime: lesson.endsAt,
    subjectName: lesson.subjectName,
    meta: meta || undefined,
    room: lesson.cabinet ? `Ауд. ${lesson.cabinet}` : undefined,
  };
}

function mapWeekSchedule(schedule?: WeekScheduleResult): HomeScheduleDay[] {
  return (schedule?.items ?? []).map((day) => ({
    date: day.date,
    lessons: sortLessons(day.items).map(mapLessonToHomeLesson),
  }));
}

export default function StudentHomePage() {
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

  const avgScore = 74.2;
  const ratingPos = 12;
  const totalStudents = 87;
  const groupName = (user as { groupName?: string })?.groupName ?? '09-411';
  const firstName = user?.firstName ?? 'Тимур';
  const weekNumber = getIsoWeekNumber(currentDay.date);

  const lessonsCountLabel = useMemo(() => {
    if (isWeekScheduleLoading) {
      return 'загружаем расписание';
    }

    if (weekScheduleError) {
      return 'расписание недоступно';
    }

    const count = currentDay.lessons.length;

    if (count === 1) {
      return '1 занятие';
    }

    if (count >= 2 && count <= 4) {
      return `${count} занятия`;
    }

    return `${count} занятий`;
  }, [currentDay.lessons.length, isWeekScheduleLoading, weekScheduleError]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero
          className={styles.homeHero}
          title={`Добрый день, ${firstName}`}
          meta={(
            <>
              <span className={styles.heroMetaItem}>{currentWeekDay}, {currentDateStr}</span>
              <span className={styles.heroMetaDot}>·</span>
              <span className={styles.heroMetaItem}>Неделя {weekNumber}</span>
              <span className={styles.heroMetaDot}>·</span>
              <strong className={styles.heroMetaStrong}>
                {lessonsCountLabel} {currentDayLabel.toLowerCase()}
              </strong>
            </>
          )}
          action={(
            <Link href="/student/schedule" className={styles.greetingLink}>
              Перейти в расписание <ArrowForwardIcon sx={{ fontSize: 22 }} />
            </Link>
          )}
        />

        <StudentHomeScheduleSection
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
        />

        <StudentHomeInsightsSection
          avgScore={avgScore}
          ratingPos={ratingPos}
          totalStudents={totalStudents}
          groupName={groupName}
          grades={MOCK_GRADES}
        />

        <StudentHomeRecentChangesSection notifications={MOCK_NOTIFICATIONS} />
      </div>
    </div>
  );
}
