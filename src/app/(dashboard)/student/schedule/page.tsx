'use client';

import { useMemo, useState } from 'react';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useRouter } from 'next/navigation';
import { PageHero, ViewSwitch, ScheduleCard, DayDivider, EmptyDayState } from '@/components/ui';
import type { DaySchedule } from './scheduleData';
import { buildWeek, parseIsoDate, TODAY_DATE, TODAY_LESSONS, WEEK_BASE_NUMBER } from './scheduleData';
import styles from './schedule.module.scss';

type ScheduleView = 'today' | 'week';

const VIEW_OPTIONS: Array<{ value: ScheduleView; label: string }> = [
  { value: 'today', label: 'Сегодня' },
  { value: 'week', label: 'Неделя' },
];

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

function formatWeekRange(days: DaySchedule[]) {
  const start = parseIsoDate(days[0].date);
  const end = parseIsoDate(days[0].date);
  end.setDate(end.getDate() + 6);
  const startDay = start.getDate();
  const endDay = end.getDate();
  const monthName = new Intl.DateTimeFormat('ru-RU', { month: 'long' }).format(end);
  return `${startDay}–${endDay} ${monthName}`;
}

export default function StudentSchedulePage() {
  const router = useRouter();
  const [view, setView] = useState<ScheduleView>('today');
  const [weekOffset, setWeekOffset] = useState(0);

  const todayLessons = useMemo(
    () => TODAY_LESSONS.slice().sort((a, b) => a.startTime.localeCompare(b.startTime)),
    []
  );
  const weekDays = useMemo(() => buildWeek(weekOffset), [weekOffset]);
  const weekNumber = WEEK_BASE_NUMBER + weekOffset;
  const isEvenWeek = weekNumber % 2 === 0;

  const heroMeta = view === 'today' ? (
    <>
      <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
      <span>{formatHeadlineDate(TODAY_DATE)}</span>
    </>
  ) : (
    <>
      <strong style={{ color: '#2a657e' }}>{isEvenWeek ? 'ЧЕТНАЯ НЕДЕЛЯ' : 'НЕЧЕТНАЯ НЕДЕЛЯ'}</strong>
      <span>·</span>
      <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
      <span>{formatWeekRange(weekDays).toUpperCase()}</span>
    </>
  );

  const heroCenter = view === 'week' ? (
    <div className={styles.weekNavigation}>
      <button
        type="button"
        className={styles.navButton}
        onClick={() => setWeekOffset((o) => o - 1)}
        aria-label="Предыдущая неделя"
      >
        <ChevronLeftRoundedIcon sx={{ fontSize: 18 }} />
        Предыдущая
      </button>
      <span className={styles.navDivider} />
      <button
        type="button"
        className={styles.navButton}
        onClick={() => setWeekOffset((o) => o + 1)}
        aria-label="Следующая неделя"
      >
        Следующая
        <ChevronRightRoundedIcon sx={{ fontSize: 18 }} />
      </button>
    </div>
  ) : undefined;

  const heroAction = <ViewSwitch options={VIEW_OPTIONS} value={view} onChange={setView} />;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero title="Расписание" meta={heroMeta} center={heroCenter} action={heroAction} />

        {view === 'today' ? (
          <section className={styles.lessonList} aria-label="Расписание на сегодня">
            {todayLessons.length > 0 ? (
              todayLessons.map((lesson) => (
                <ScheduleCard
                  key={lesson.id}
                  startTime={lesson.startTime}
                  endTime={lesson.endTime}
                  subjectName={lesson.subjectName}
                  lessonType={lesson.lessonType}
                  room={lesson.room}
                  teacherName={lesson.teacherName}
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
            {weekDays.map((day) => (
              <div key={day.date} className={styles.weekDay}>
                <DayDivider label={formatDayTitle(day.date)} />
                {day.lessons.length > 0 ? (
                  <div className={styles.dayLessons}>
                    {day.lessons.map((lesson) => (
                      <ScheduleCard
                        key={lesson.id}
                        startTime={lesson.startTime}
                        endTime={lesson.endTime}
                        subjectName={lesson.subjectName}
                        lessonType={lesson.lessonType}
                        room={lesson.room}
                        teacherName={lesson.teacherName}
                        onMore={() => router.push(`/student/subjects/${lesson.subjectId}`)}
                        moreLabel={`Перейти к ${lesson.subjectName}`}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyDayState />
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
