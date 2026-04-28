'use client';

import { useMemo, useState } from 'react';
import { Typography } from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { ScheduleLessonCard } from './ScheduleLessonCard';
import type { DaySchedule } from './scheduleData';
import { buildWeek, parseIsoDate, TODAY_DATE, TODAY_LESSONS, WEEK_BASE_NUMBER } from './scheduleData';
import styles from './schedule.module.scss';

type ScheduleView = 'today' | 'week';

function formatHeadlineDate(dateStr: string) {
  const date = parseIsoDate(dateStr);
  const weekday = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' }).format(date).toUpperCase();
  const dayAndMonth = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(date).toUpperCase();

  return `${weekday}, ${dayAndMonth}`;
}

function formatDayTitle(dateStr: string) {
  const date = parseIsoDate(dateStr);
  const weekday = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' }).format(date);
  const dayAndMonth = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(date);

  return `${weekday}, ${dayAndMonth}`.toUpperCase();
}

function formatWeekRange(days: DaySchedule[]) {
  const start = parseIsoDate(days[0].date);
  const end = parseIsoDate(days[days.length - 1].date);
  const startLabel = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(start);
  const endLabel = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(end);

  return `${startLabel} — ${endLabel}`;
}

// TODO: Стоит разбить страницу на блоки, например: Greeting, SchedulePreview, RatingSummary, ChangesList.
//  Старайтесь не писать большие компоненты, которые делают сразу всё.
//  Если у компонента есть несколько логических блоков, лучше разбить его на несколько маленьких
export default function StudentSchedulePage() {
  const [view, setView] = useState<ScheduleView>('today');
  const [weekOffset, setWeekOffset] = useState(0);

  const todayLessons = useMemo(
    () => TODAY_LESSONS.slice().sort((a, b) => a.startTime.localeCompare(b.startTime)),
    []
  );
  const weekDays = useMemo(() => buildWeek(weekOffset), [weekOffset]);
  const weekNumber = WEEK_BASE_NUMBER + weekOffset;
  const isEvenWeek = weekNumber % 2 === 0;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={`${styles.hero} ${view === 'week' ? styles.heroWeek : ''}`}>
          <div className={styles.heroInner}>
            <Typography component="h1" className={styles.title}>
              Расписание
            </Typography>

            {view === 'today' ? (
              <div className={styles.subtitleRow}>
                <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
                <p className={styles.subtitle}>{formatHeadlineDate(TODAY_DATE)}</p>
              </div>
            ) : (
              <div className={styles.weekInfo}>
                <span className={styles.weekBadge}>
                  {isEvenWeek ? 'Четная неделя' : 'Нечетная неделя'}
                </span>
                <span className={styles.weekPeriod}>
                  <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
                  Текущий период: {formatWeekRange(weekDays)}
                </span>
              </div>
            )}
          </div>

          <div className={styles.heroActions}>
            {view === 'week' && (
              <div className={styles.weekNavigation} aria-label="Навигация по неделям">
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={() => setWeekOffset((current) => current - 1)}
                >
                  <ChevronLeftRoundedIcon sx={{ fontSize: 16 }} />
                  <span>Предыдущая</span>
                </button>
                <button
                  type="button"
                  className={styles.navButton}
                  onClick={() => setWeekOffset((current) => current + 1)}
                >
                  <span>Следующая</span>
                  <ChevronRightRoundedIcon sx={{ fontSize: 16 }} />
                </button>
              </div>
            )}

            <div className={styles.viewSwitch} aria-label="Режим просмотра расписания">
              <button
                type="button"
                className={`${styles.viewButton} ${view === 'today' ? styles.viewButtonActive : ''}`}
                onClick={() => setView('today')}
              >
                Сегодня
              </button>
              <button
                type="button"
                className={`${styles.viewButton} ${view === 'week' ? styles.viewButtonActive : ''}`}
                onClick={() => setView('week')}
              >
                Неделя
              </button>
            </div>
          </div>
        </section>

        {view === 'today' ? (
          <section className={styles.scheduleSection}>
            {todayLessons.length > 0 ? (
              <div className={styles.lessonList}>
                {todayLessons.map((lesson) => (
                  <ScheduleLessonCard key={lesson.id} lesson={lesson} />
                ))}
              </div>
            ) : (
              <div className={`${styles.lessonCard} ${styles.lessonCardState}`}>
                <Typography component="p" className={styles.stateText}>
                  На сегодня занятий нет.
                </Typography>
              </div>
            )}
          </section>
        ) : (
          <section className={styles.weekSection}>
            {weekDays.map((day) => (
              <div key={day.date} className={styles.daySection}>
                <div className={styles.dayHeader}>
                  <span className={styles.dayLine} />
                  <span className={styles.dayTitle}>{formatDayTitle(day.date)}</span>
                  <span className={styles.dayLine} />
                </div>

                {day.lessons.length > 0 ? (
                  <div className={styles.lessonList}>
                    {day.lessons.map((lesson) => (
                      <ScheduleLessonCard key={lesson.id} lesson={lesson} />
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <span className={styles.emptyTitle}>Нет пар</span>
                    <span className={styles.emptySubtitle}>Свободный от занятий день</span>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
