'use client';

import { useState } from 'react';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import styles from './lessons.module.scss';

type ViewMode = 'today' | 'week';

interface TeacherLesson {
  id: number;
  time: string;
  title: string;
  type: string;
  room: string;
  groups: string;
}

interface ScheduleDay {
  id: string;
  label: string;
  date: string;
  lessons: TeacherLesson[];
}

interface ScheduleWeek {
  id: string;
  parity: string;
  period: string;
  days: ScheduleDay[];
}

const TODAY_LESSONS: TeacherLesson[] = [
  {
    id: 1,
    time: '08:30 — 10:00',
    title: 'Математический анализ',
    type: 'Лекция',
    room: 'Ауд. 1108',
    groups: '09-352, 09-353',
  },
  {
    id: 2,
    time: '10:20 — 11:50',
    title: 'Базы данных',
    type: 'Лекция',
    room: 'Ауд. 1101',
    groups: '09-352, 09-353',
  },
  {
    id: 3,
    time: '12:10 — 13:40',
    title: 'Дискретная математика',
    type: 'Практика',
    room: 'Ауд. 602',
    groups: '09-352',
  },
  {
    id: 4,
    time: '14:00 — 15:30',
    title: 'Программная инженерия',
    type: 'Лабораторная',
    room: 'Ауд. 310',
    groups: '09-352, 09-353',
  },
];

const MOCK_WEEKS: ScheduleWeek[] = [
  {
    id: '2025-04-07',
    parity: 'Нечетная неделя',
    period: '7–13 апреля',
    days: [
      {
        id: 'monday-2025-04-07',
        label: 'Понедельник',
        date: '7 апреля',
        lessons: [
          {
            id: 101,
            time: '10:20 — 11:50',
            title: 'Базы данных',
            type: 'Лекция',
            room: 'Ауд. 1101',
            groups: '09-352, 09-353',
          },
        ],
      },
      {
        id: 'tuesday-2025-04-08',
        label: 'Вторник',
        date: '8 апреля',
        lessons: [
          {
            id: 102,
            time: '08:30 — 10:00',
            title: 'Дискретная математика',
            type: 'Практика',
            room: 'Ауд. 602',
            groups: '09-352',
          },
          {
            id: 103,
            time: '12:10 — 13:40',
            title: 'Программная инженерия',
            type: 'Лабораторная',
            room: 'Ауд. 310',
            groups: '09-352, 09-353',
          },
        ],
      },
      {
        id: 'wednesday-2025-04-09',
        label: 'Среда',
        date: '9 апреля',
        lessons: TODAY_LESSONS,
      },
      {
        id: 'thursday-2025-04-10',
        label: 'Четверг',
        date: '10 апреля',
        lessons: [],
      },
      {
        id: 'friday-2025-04-11',
        label: 'Пятница',
        date: '11 апреля',
        lessons: [
          {
            id: 104,
            time: '14:00 — 15:30',
            title: 'Операционные системы',
            type: 'Практика',
            room: 'Ауд. 205',
            groups: '09-352',
          },
        ],
      },
      {
        id: 'saturday-2025-04-12',
        label: 'Суббота',
        date: '12 апреля',
        lessons: [],
      },
    ],
  },
  {
    id: '2025-04-14',
    parity: 'Четная неделя',
    period: '14–20 апреля',
    days: [
      {
        id: 'monday-2025-04-14',
        label: 'Понедельник',
        date: '14 апреля',
        lessons: TODAY_LESSONS.slice(0, 2),
      },
      {
        id: 'tuesday-2025-04-15',
        label: 'Вторник',
        date: '15 апреля',
        lessons: TODAY_LESSONS.slice(2),
      },
      {
        id: 'wednesday-2025-04-16',
        label: 'Среда',
        date: '16 апреля',
        lessons: [],
      },
      {
        id: 'thursday-2025-04-17',
        label: 'Четверг',
        date: '17 апреля',
        lessons: [
          {
            id: 5,
            time: '08:30 — 10:00',
            title: 'Численные методы',
            type: 'Лекция',
            room: 'Ауд. 1109',
            groups: '09-352, 09-353',
          },
        ],
      },
      {
        id: 'friday-2025-04-18',
        label: 'Пятница',
        date: '18 апреля',
        lessons: [
          {
            id: 6,
            time: '10:20 — 11:50',
            title: 'Операционные системы',
            type: 'Практика',
            room: 'Ауд. 205',
            groups: '09-352',
          },
        ],
      },
      {
        id: 'saturday-2025-04-19',
        label: 'Суббота',
        date: '19 апреля',
        lessons: [],
      },
    ],
  },
  {
    id: '2025-04-21',
    parity: 'Нечетная неделя',
    period: '21–27 апреля',
    days: [
      {
        id: 'monday-2025-04-21',
        label: 'Понедельник',
        date: '21 апреля',
        lessons: [
          {
            id: 201,
            time: '08:30 — 10:00',
            title: 'Математический анализ',
            type: 'Лекция',
            room: 'Ауд. 1108',
            groups: '09-352, 09-353',
          },
          {
            id: 202,
            time: '12:10 — 13:40',
            title: 'Базы данных',
            type: 'Лабораторная',
            room: 'Ауд. 1101',
            groups: '09-352',
          },
        ],
      },
      {
        id: 'tuesday-2025-04-22',
        label: 'Вторник',
        date: '22 апреля',
        lessons: [],
      },
      {
        id: 'wednesday-2025-04-23',
        label: 'Среда',
        date: '23 апреля',
        lessons: [
          {
            id: 203,
            time: '10:20 — 11:50',
            title: 'Дискретная математика',
            type: 'Практика',
            room: 'Ауд. 602',
            groups: '09-352',
          },
        ],
      },
      {
        id: 'thursday-2025-04-24',
        label: 'Четверг',
        date: '24 апреля',
        lessons: [
          {
            id: 204,
            time: '14:00 — 15:30',
            title: 'Программная инженерия',
            type: 'Лабораторная',
            room: 'Ауд. 310',
            groups: '09-352, 09-353',
          },
        ],
      },
      {
        id: 'friday-2025-04-25',
        label: 'Пятница',
        date: '25 апреля',
        lessons: [
          {
            id: 205,
            time: '08:30 — 10:00',
            title: 'Численные методы',
            type: 'Лекция',
            room: 'Ауд. 1109',
            groups: '09-352, 09-353',
          },
        ],
      },
      {
        id: 'saturday-2025-04-26',
        label: 'Суббота',
        date: '26 апреля',
        lessons: [],
      },
    ],
  },
];

const CURRENT_WEEK_INDEX = 1;

const getWeekButtonLabel = (direction: 'previous' | 'next', week: ScheduleWeek | undefined) => {
  const action = direction === 'previous' ? 'Показать предыдущую неделю' : 'Показать следующую неделю';

  return week ? `${action}: ${week.period}` : action;
};

function LessonRow({ lesson }: { lesson: TeacherLesson }) {
  return (
    <article className={styles.lessonCard}>
      <time className={styles.lessonTime}>{lesson.time}</time>

      <div className={styles.lessonBody}>
        <h2 className={styles.lessonTitle}>{lesson.title}</h2>
        <div className={styles.lessonMeta}>
          <span>{lesson.type}</span>
          <span className={styles.room}>
            <LocationOnOutlinedIcon sx={{ fontSize: 20 }} />
            {lesson.room}
          </span>
          <span>{lesson.groups}</span>
        </div>
      </div>

      <button type="button" className={styles.moreButton} aria-label={`Действия: ${lesson.title}`}>
        <MoreHorizRoundedIcon sx={{ fontSize: 24 }} />
      </button>
    </article>
  );
}

function DayDivider({ day }: { day: ScheduleDay }) {
  return (
    <div className={styles.dayDivider}>
      <span className={styles.dayLabel}>
        {day.label}, {day.date}
      </span>
    </div>
  );
}

function EmptyDay() {
  return (
    <div className={styles.emptyDay}>
      <p>Нет пар</p>
      <span>Свободный от занятий день</span>
    </div>
  );
}

export default function TeacherLessonsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('today');
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(CURRENT_WEEK_INDEX);

  const isToday = viewMode === 'today';
  const selectedWeek = MOCK_WEEKS[selectedWeekIndex] ?? MOCK_WEEKS[CURRENT_WEEK_INDEX];
  const previousWeek = MOCK_WEEKS[selectedWeekIndex - 1];
  const nextWeek = MOCK_WEEKS[selectedWeekIndex + 1];

  const handlePreviousWeek = () => {
    setSelectedWeekIndex((index) => Math.max(index - 1, 0));
  };

  const handleNextWeek = () => {
    setSelectedWeekIndex((index) => Math.min(index + 1, MOCK_WEEKS.length - 1));
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>Расписание</h1>
            {isToday ? (
              <div className={styles.metaLine}>
                <CalendarTodayOutlinedIcon sx={{ fontSize: 18 }} />
                <span>Среда, 9 апреля</span>
              </div>
            ) : (
              <div className={styles.metaLine}>
                <strong>{selectedWeek.parity}</strong>
                <span className={styles.metaDivider} />
                <CalendarTodayOutlinedIcon sx={{ fontSize: 18 }} />
                <span>{selectedWeek.period}</span>
              </div>
            )}
          </div>

          {!isToday && (
            <div className={styles.periodControls}>
              <button
                type="button"
                className={styles.periodButton}
                onClick={handlePreviousWeek}
                disabled={!previousWeek}
                aria-label={getWeekButtonLabel('previous', previousWeek)}
              >
                <ChevronLeftRoundedIcon sx={{ fontSize: 22 }} />
                Предыдущая
              </button>
              <span className={styles.periodDivider} />
              <button
                type="button"
                className={styles.periodButton}
                onClick={handleNextWeek}
                disabled={!nextWeek}
                aria-label={getWeekButtonLabel('next', nextWeek)}
              >
                Следующая
                <ChevronRightRoundedIcon sx={{ fontSize: 22 }} />
              </button>
            </div>
          )}

          <div className={styles.viewSwitch} role="tablist" aria-label="Вид расписания">
            <button
              type="button"
              className={`${styles.viewButton} ${isToday ? styles.viewButtonActive : ''}`}
              onClick={() => setViewMode('today')}
              aria-selected={isToday}
              role="tab"
            >
              Сегодня
            </button>
            <button
              type="button"
              className={`${styles.viewButton} ${!isToday ? styles.viewButtonActive : ''}`}
              onClick={() => setViewMode('week')}
              aria-selected={!isToday}
              role="tab"
            >
              Неделя
            </button>
          </div>
        </header>

        {isToday ? (
          <section className={styles.todayList} aria-label="Расписание на сегодня">
            {TODAY_LESSONS.map((lesson) => (
              <LessonRow key={lesson.id} lesson={lesson} />
            ))}
          </section>
        ) : (
          <section className={styles.weekList} aria-label="Расписание на неделю" aria-live="polite">
            {selectedWeek.days.map((day) => (
              <div key={day.id} className={styles.weekDay}>
                <DayDivider day={day} />
                {day.lessons.length > 0 ? (
                  <div className={styles.dayLessons}>
                    {day.lessons.map((lesson) => (
                      <LessonRow key={lesson.id} lesson={lesson} />
                    ))}
                  </div>
                ) : (
                  <EmptyDay />
                )}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
