'use client';

import { useMemo, useState } from 'react';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { useRouter } from 'next/navigation';
import { PageHero, ViewSwitch, WeekNavigation, ScheduleCard, DayDivider, EmptyDayState } from '@/components/ui';
import { useDaySchedule, useWeekSchedule } from '@/lib/hooks/useSchedule';
import type { ScheduleLessonResult, WeekScheduleResult } from '@/lib/api/types';
import { getIsoWeekNumber, getLocalIsoDate, getWeekStart, parseIsoDate, shiftIsoDate } from '@/lib/utils/isoDate';
import styles from './schedule.module.scss';

type ScheduleView = 'today' | 'week';

type WeekDaySchedule = {
  date: string;
  lessons: ScheduleLessonResult[];
};

const VIEW_OPTIONS: Array<{ value: ScheduleView; label: string }> = [
  { value: 'today', label: 'Сегодня' },
  { value: 'week', label: 'Неделя' },
];

function buildEmptyWeek(anchorDate: string): WeekDaySchedule[] {
  const monday = getWeekStart(anchorDate);

  return Array.from({ length: 6 }, (_, index) => ({
    date: shiftIsoDate(monday, index),
    lessons: [],
  }));
}

function formatHeadlineDate(dateStr: string) {
  const date = parseIsoDate(dateStr);
  const weekday = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' }).format(date).toUpperCase();
  const dayAndMonth = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(date).toUpperCase();
  return `${weekday}, ${dayAndMonth}`;
}

function formatDayTitle(dateStr: string) {
  const date = parseIsoDate(dateStr);
  const weekday = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' }).format(date);
  const dayAndMonth = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(date);
  return `${weekday}, ${dayAndMonth}`.toUpperCase();
}

function formatWeekRange(days: WeekDaySchedule[]) {
  const start = parseIsoDate(days[0].date);
  const end = parseIsoDate(days[days.length - 1].date);
  const startDay = start.getDate();
  const endDay = end.getDate();
  const startMonth = new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(start);
  const endMonth = new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(end);

  if (startMonth === endMonth) {
    return `${startDay}-${endDay} ${endMonth}`;
  }

  return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
}

function formatTeacherName(lesson: ScheduleLessonResult) {
  return [lesson.teacherLastName, lesson.teacherFirstName, lesson.teacherFatherName]
    .filter(Boolean)
    .join(' ');
}

function sortLessons(lessons: ScheduleLessonResult[] | null | undefined) {
  return (lessons ?? []).slice().sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

function mapWeekSchedule(schedule?: WeekScheduleResult): WeekDaySchedule[] {
  return (schedule?.items ?? []).map((day) => ({
    date: day.date,
    lessons: sortLessons(day.items),
  }));
}

export default function StudentSchedulePage() {
  const router = useRouter();
  const [view, setView] = useState<ScheduleView>('today');
  const [weekOffset, setWeekOffset] = useState(0);
  const todayDate = getLocalIsoDate();
  const weekAnchorDate = useMemo(() => shiftIsoDate(todayDate, weekOffset * 7), [todayDate, weekOffset]);

  const {
    data: todaySchedule,
    isLoading: isTodayScheduleLoading,
    error: todayScheduleError,
  } = useDaySchedule(todayDate);

  const {
    data: weekSchedule,
    isLoading: isWeekScheduleLoading,
    error: weekScheduleError,
  } = useWeekSchedule(weekAnchorDate, view === 'week');

  const todayLessons = useMemo(
    () => sortLessons(todaySchedule?.items),
    [todaySchedule?.items]
  );

  const weekDays = useMemo(() => mapWeekSchedule(weekSchedule), [weekSchedule]);
  const displayWeekDays = weekDays.length > 0 ? weekDays : buildEmptyWeek(weekAnchorDate);
  const weekNumber = weekOffset === 0 && todaySchedule?.weekNumber
    ? todaySchedule.weekNumber
    : getIsoWeekNumber(weekAnchorDate);
  const isEvenWeek = weekNumber % 2 === 0;
  const headlineDate = todaySchedule?.date ?? todayDate;

  const heroMeta = view === 'today' ? (
    <>
      <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
      <span>{formatHeadlineDate(headlineDate)}</span>
    </>
  ) : (
    <>
      <strong style={{ color: '#2a657e' }}>{isEvenWeek ? 'ЧЕТНАЯ НЕДЕЛЯ' : 'НЕЧЕТНАЯ НЕДЕЛЯ'}</strong>
      <span>·</span>
      <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
      <span>{formatWeekRange(displayWeekDays).toUpperCase()}</span>
    </>
  );

  const heroCenter = view === 'week' ? (
    <WeekNavigation
      onPrevious={() => setWeekOffset((o) => o - 1)}
      onNext={() => setWeekOffset((o) => o + 1)}
    />
  ) : undefined;

  const heroAction = <ViewSwitch options={VIEW_OPTIONS} value={view} onChange={setView} />;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero
          className={styles.scheduleHero}
          title="Расписание"
          meta={heroMeta}
          center={heroCenter}
          action={heroAction}
        />

        {view === 'today' ? (
          <section className={styles.lessonList} aria-label="Расписание на сегодня">
            {isTodayScheduleLoading ? (
              <EmptyDayState title="Загружаем расписание" subtitle="Получаем данные с бэка" />
            ) : todayScheduleError ? (
              <EmptyDayState title="Не удалось загрузить расписание" subtitle="Проверьте запуск бэка и авторизацию" />
            ) : todayLessons.length > 0 ? (
              todayLessons.map((lesson) => (
                <ScheduleCard
                  key={lesson.lessonsId}
                  startTime={lesson.startsAt}
                  endTime={lesson.endsAt}
                  subjectName={lesson.subjectName}
                  lessonType={lesson.type ?? undefined}
                  room={lesson.cabinet ? `Ауд. ${lesson.cabinet}` : undefined}
                  teacherName={formatTeacherName(lesson)}
                  onMore={() => router.push(`/student/subjects/${lesson.subjectId}`)}
                  moreLabel={`Перейти к ${lesson.subjectName}`}
                />
              ))
            ) : (
              <EmptyDayState title="На сегодня занятий нет" />
            )}
          </section>
        ) : (
          <section className={styles.weekList} aria-label="Расписание на неделю">
            {isWeekScheduleLoading ? (
              <EmptyDayState title="Загружаем неделю" subtitle="Получаем расписание с бэка" />
            ) : weekScheduleError ? (
              <EmptyDayState title="Не удалось загрузить неделю" subtitle="Проверьте запуск бэка и авторизацию" />
            ) : (
              displayWeekDays.map((day) => (
                <div key={day.date} className={styles.weekDay}>
                  <DayDivider label={formatDayTitle(day.date)} />
                  {day.lessons.length > 0 ? (
                    <div className={styles.dayLessons}>
                      {day.lessons.map((lesson) => (
                        <ScheduleCard
                          key={lesson.lessonsId}
                          startTime={lesson.startsAt}
                          endTime={lesson.endsAt}
                          subjectName={lesson.subjectName}
                          lessonType={lesson.type ?? undefined}
                          room={lesson.cabinet ? `Ауд. ${lesson.cabinet}` : undefined}
                          teacherName={formatTeacherName(lesson)}
                          onMore={() => router.push(`/student/subjects/${lesson.subjectId}`)}
                          moreLabel={`Перейти к ${lesson.subjectName}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyDayState />
                  )}
                </div>
              ))
            )}
          </section>
        )}
      </div>
    </div>
  );
}
