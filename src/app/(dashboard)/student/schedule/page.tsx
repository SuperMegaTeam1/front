'use client';

import { useMemo, useState } from 'react';
import { Typography } from '@mui/material';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { ScheduleLessonCard, type ScheduleLessonCardData } from './ScheduleLessonCard';
import styles from './schedule.module.scss';

type ScheduleView = 'today' | 'week';

type DaySchedule = {
  date: string;
  lessons: ScheduleLessonCardData[];
};

const TODAY_DATE = '2026-04-09';
const WEEK_BASE_START = '2026-04-14';
const WEEK_BASE_NUMBER = 16;

const TODAY_LESSONS: ScheduleLessonCardData[] = [
  {
    id: 1,
    subjectId: 1,
    subjectName: 'Математический анализ',
    teacherName: 'Иванов И.И.',
    groupId: 9411,
    groupName: '09-411',
    date: TODAY_DATE,
    startTime: '08:30',
    endTime: '10:00',
    room: 'Ауд. 1108',
    lessonNumber: 1,
    lessonType: 'Лекция',
  },
  {
    id: 2,
    subjectId: 2,
    subjectName: 'Базы данных',
    teacherName: 'Сафиуллин Р.Н.',
    groupId: 9411,
    groupName: '09-411',
    date: TODAY_DATE,
    startTime: '10:20',
    endTime: '11:50',
    room: 'Ауд. 1101',
    lessonNumber: 2,
    lessonType: 'Лекция',
  },
  {
    id: 3,
    subjectId: 3,
    subjectName: 'Дискретная математика',
    teacherName: 'Новиков А.В.',
    groupId: 9411,
    groupName: '09-411',
    date: TODAY_DATE,
    startTime: '12:10',
    endTime: '13:40',
    room: 'Ауд. 602',
    lessonNumber: 3,
    lessonType: 'Практика',
  },
  {
    id: 4,
    subjectId: 4,
    subjectName: 'Программная инженерия',
    teacherName: 'Батрушина Г.С.',
    groupId: 9411,
    groupName: '09-411',
    date: TODAY_DATE,
    startTime: '14:00',
    endTime: '15:30',
    room: 'Ауд. 310',
    lessonNumber: 4,
    lessonType: 'Лабораторная',
  },
];

const WEEK_TEMPLATE: Omit<DaySchedule, 'date'>[] = [
  {
    lessons: [
      {
        id: 11,
        subjectId: 1,
        subjectName: 'Математический анализ',
        teacherName: 'Иванов И.И.',
        groupId: 9411,
        groupName: '09-411',
        date: '',
        startTime: '08:30',
        endTime: '10:00',
        room: 'Ауд. 1108',
        lessonNumber: 1,
        lessonType: 'Лекция',
      },
      {
        id: 12,
        subjectId: 2,
        subjectName: 'Базы данных',
        teacherName: 'Сафиуллин Р.Н.',
        groupId: 9411,
        groupName: '09-411',
        date: '',
        startTime: '10:20',
        endTime: '11:50',
        room: 'Ауд. 1101',
        lessonNumber: 2,
        lessonType: 'Лекция',
      },
    ],
  },
  {
    lessons: [
      {
        id: 13,
        subjectId: 3,
        subjectName: 'Дискретная математика',
        teacherName: 'Новиков А.В.',
        groupId: 9411,
        groupName: '09-411',
        date: '',
        startTime: '12:10',
        endTime: '13:40',
        room: 'Ауд. 602',
        lessonNumber: 3,
        lessonType: 'Практика',
      },
      {
        id: 14,
        subjectId: 4,
        subjectName: 'Программная инженерия',
        teacherName: 'Батрушина Г.С.',
        groupId: 9411,
        groupName: '09-411',
        date: '',
        startTime: '14:00',
        endTime: '15:30',
        room: 'Ауд. 310',
        lessonNumber: 4,
        lessonType: 'Лабораторная',
      },
    ],
  },
  {
    lessons: [],
  },
  {
    lessons: [
      {
        id: 15,
        subjectId: 5,
        subjectName: 'Численные методы',
        teacherName: 'Васильев Р.А.',
        groupId: 9411,
        groupName: '09-411',
        date: '',
        startTime: '08:30',
        endTime: '10:00',
        room: 'Ауд. 1109',
        lessonNumber: 1,
        lessonType: 'Лекция',
      },
    ],
  },
  {
    lessons: [
      {
        id: 16,
        subjectId: 6,
        subjectName: 'Операционные системы',
        teacherName: 'Кузнецов С.П.',
        groupId: 9411,
        groupName: '09-411',
        date: '',
        startTime: '10:20',
        endTime: '11:50',
        room: 'Ауд. 205',
        lessonNumber: 2,
        lessonType: 'Практика',
      },
    ],
  },
  {
    lessons: [],
  },
];

function parseIsoDate(dateStr: string) {
  return new Date(`${dateStr}T12:00:00`);
}

function shiftIsoDate(dateStr: string, days: number) {
  const date = parseIsoDate(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

function buildWeek(offset: number): DaySchedule[] {
  const startDate = shiftIsoDate(WEEK_BASE_START, offset * 7);

  return WEEK_TEMPLATE.map((day, index) => {
    const date = shiftIsoDate(startDate, index);

    return {
      date,
      lessons: day.lessons.map((lesson) => ({
        ...lesson,
        date,
        id: lesson.id + offset * 100 + index * 10,
      })),
    };
  });
}

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
                <span className={styles.weekPeriod}>Текущий период: {formatWeekRange(weekDays)}</span>
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
