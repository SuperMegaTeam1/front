'use client';

import { useMemo, useState } from 'react';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { useRouter } from 'next/navigation';
import { PageHero, ViewSwitch, WeekNavigation, ScheduleCard, DayDivider, EmptyDayState } from '@/components/ui';
import { useDaySchedule, useWeekSchedule } from '@/lib/hooks/useSchedule';
import type { ScheduleLessonResult } from '@/lib/api/types';
import { getIsoWeekNumber, getLocalIsoDate, shiftIsoDate } from '@/lib/utils/isoDate';
import {
  buildEmptyScheduleWeek,
  formatScheduleDayTitle,
  formatScheduleHeadlineDate,
  formatScheduleWeekRange,
  mapBackendWeekToScheduleDays,
  type ScheduleDay,
  sortScheduleLessons,
} from '@/lib/utils/schedule';
import styles from './schedule.module.scss';

type ScheduleView = 'today' | 'week';
type WeekDaySchedule = ScheduleDay<ScheduleLessonResult>;

const VIEW_OPTIONS: Array<{ value: ScheduleView; label: string }> = [
  { value: 'today', label: 'Сегодня' },
  { value: 'week', label: 'Неделя' },
];

function formatTeacherName(lesson: ScheduleLessonResult) {
  return [lesson.teacherLastName, lesson.teacherFirstName, lesson.teacherFatherName]
    .filter(Boolean)
    .join(' ');
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
    () => sortScheduleLessons(todaySchedule?.items),
    [todaySchedule?.items]
  );

  const weekDays = useMemo<WeekDaySchedule[]>(
    () => mapBackendWeekToScheduleDays(weekSchedule, (lesson) => lesson),
    [weekSchedule]
  );
  const displayWeekDays = weekDays.length > 0
    ? weekDays
    : buildEmptyScheduleWeek<ScheduleLessonResult>(weekAnchorDate);
  const weekNumber = weekOffset === 0 && todaySchedule?.weekNumber
    ? todaySchedule.weekNumber
    : getIsoWeekNumber(weekAnchorDate);
  const isEvenWeek = weekNumber % 2 === 0;
  const headlineDate = todaySchedule?.date ?? todayDate;

  const heroMeta = view === 'today' ? (
    <>
      <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
      <span>{formatScheduleHeadlineDate(headlineDate)}</span>
    </>
  ) : (
    <span className={styles.weekMeta}>
      <strong className={styles.weekMetaLabel}>{isEvenWeek ? 'ЧЕТНАЯ НЕДЕЛЯ' : 'НЕЧЕТНАЯ НЕДЕЛЯ'}</strong>
      <span className={styles.weekMetaPeriod}>
        <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
        <span>{formatScheduleWeekRange(displayWeekDays).toUpperCase()}</span>
      </span>
    </span>
  );

  const heroCenter = view === 'week' ? (
    <WeekNavigation
      onPrevious={() => setWeekOffset((offset) => offset - 1)}
      onNext={() => setWeekOffset((offset) => offset + 1)}
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
                  <DayDivider label={formatScheduleDayTitle(day.date)} />
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
