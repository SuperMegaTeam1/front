'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { PageHero, ViewSwitch, WeekNavigation, ScheduleCard, DayDivider, EmptyDayState } from '@/components/ui';
import styles from './schedule.module.scss';

type ViewMode = 'today' | 'week';

interface TeacherLesson {
  id: number;
  startTime: string;
  endTime: string;
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
  { id: 1, startTime: '08:30', endTime: '10:00', title: 'Математический анализ', type: 'Лекция', room: 'Ауд. 1108', groups: '09-352, 09-353' },
  { id: 2, startTime: '10:20', endTime: '11:50', title: 'Базы данных', type: 'Лекция', room: 'Ауд. 1101', groups: '09-352, 09-353' },
  { id: 3, startTime: '12:10', endTime: '13:40', title: 'Дискретная математика', type: 'Практика', room: 'Ауд. 602', groups: '09-352' },
  { id: 4, startTime: '14:00', endTime: '15:30', title: 'Программная инженерия', type: 'Лабораторная', room: 'Ауд. 310', groups: '09-352, 09-353' },
];

const MOCK_WEEKS: ScheduleWeek[] = [
  {
    id: '2025-04-07',
    parity: 'Нечетная неделя',
    period: '7–13 апреля',
    days: [
      { id: 'mon-1', label: 'Понедельник', date: '7 апреля', lessons: [{ id: 101, startTime: '10:20', endTime: '11:50', title: 'Базы данных', type: 'Лекция', room: 'Ауд. 1101', groups: '09-352, 09-353' }] },
      { id: 'tue-1', label: 'Вторник', date: '8 апреля', lessons: [{ id: 102, startTime: '08:30', endTime: '10:00', title: 'Дискретная математика', type: 'Практика', room: 'Ауд. 602', groups: '09-352' }, { id: 103, startTime: '12:10', endTime: '13:40', title: 'Программная инженерия', type: 'Лабораторная', room: 'Ауд. 310', groups: '09-352, 09-353' }] },
      { id: 'wed-1', label: 'Среда', date: '9 апреля', lessons: TODAY_LESSONS },
      { id: 'thu-1', label: 'Четверг', date: '10 апреля', lessons: [] },
      { id: 'fri-1', label: 'Пятница', date: '11 апреля', lessons: [{ id: 104, startTime: '14:00', endTime: '15:30', title: 'Операционные системы', type: 'Практика', room: 'Ауд. 205', groups: '09-352' }] },
      { id: 'sat-1', label: 'Суббота', date: '12 апреля', lessons: [] },
    ],
  },
  {
    id: '2025-04-14',
    parity: 'Четная неделя',
    period: '14–20 апреля',
    days: [
      { id: 'mon-2', label: 'Понедельник', date: '14 апреля', lessons: TODAY_LESSONS.slice(0, 2) },
      { id: 'tue-2', label: 'Вторник', date: '15 апреля', lessons: TODAY_LESSONS.slice(2) },
      { id: 'wed-2', label: 'Среда', date: '16 апреля', lessons: [] },
      { id: 'thu-2', label: 'Четверг', date: '17 апреля', lessons: [{ id: 5, startTime: '08:30', endTime: '10:00', title: 'Численные методы', type: 'Лекция', room: 'Ауд. 1109', groups: '09-352, 09-353' }] },
      { id: 'fri-2', label: 'Пятница', date: '18 апреля', lessons: [{ id: 6, startTime: '10:20', endTime: '11:50', title: 'Операционные системы', type: 'Практика', room: 'Ауд. 205', groups: '09-352' }] },
      { id: 'sat-2', label: 'Суббота', date: '19 апреля', lessons: [] },
    ],
  },
  {
    id: '2025-04-21',
    parity: 'Нечетная неделя',
    period: '21–27 апреля',
    days: [
      { id: 'mon-3', label: 'Понедельник', date: '21 апреля', lessons: [{ id: 201, startTime: '08:30', endTime: '10:00', title: 'Математический анализ', type: 'Лекция', room: 'Ауд. 1108', groups: '09-352, 09-353' }, { id: 202, startTime: '12:10', endTime: '13:40', title: 'Базы данных', type: 'Лабораторная', room: 'Ауд. 1101', groups: '09-352' }] },
      { id: 'tue-3', label: 'Вторник', date: '22 апреля', lessons: [] },
      { id: 'wed-3', label: 'Среда', date: '23 апреля', lessons: [{ id: 203, startTime: '10:20', endTime: '11:50', title: 'Дискретная математика', type: 'Практика', room: 'Ауд. 602', groups: '09-352' }] },
      { id: 'thu-3', label: 'Четверг', date: '24 апреля', lessons: [{ id: 204, startTime: '14:00', endTime: '15:30', title: 'Программная инженерия', type: 'Лабораторная', room: 'Ауд. 310', groups: '09-352, 09-353' }] },
      { id: 'fri-3', label: 'Пятница', date: '25 апреля', lessons: [{ id: 205, startTime: '08:30', endTime: '10:00', title: 'Численные методы', type: 'Лекция', room: 'Ауд. 1109', groups: '09-352, 09-353' }] },
      { id: 'sat-3', label: 'Суббота', date: '26 апреля', lessons: [] },
    ],
  },
];

const CURRENT_WEEK_INDEX = 1;

const VIEW_OPTIONS: Array<{ value: ViewMode; label: string }> = [
  { value: 'today', label: 'Сегодня' },
  { value: 'week', label: 'Неделя' },
];

export default function TeacherSchedulePage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('today');
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(CURRENT_WEEK_INDEX);

  const isToday = viewMode === 'today';
  const selectedWeek = MOCK_WEEKS[selectedWeekIndex] ?? MOCK_WEEKS[CURRENT_WEEK_INDEX];
  const previousWeek = MOCK_WEEKS[selectedWeekIndex - 1];
  const nextWeek = MOCK_WEEKS[selectedWeekIndex + 1];

  const heroMeta = isToday ? (
    <>
      <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
      <span>СРЕДА, 9 АПРЕЛЯ</span>
    </>
  ) : (
    <>
      <strong style={{ color: '#2a657e' }}>{selectedWeek.parity.toUpperCase()}</strong>
      <span>·</span>
      <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
      <span>{selectedWeek.period.toUpperCase()}</span>
    </>
  );

  const heroCenter = !isToday ? (
    <WeekNavigation
      onPrevious={() => setSelectedWeekIndex((i) => Math.max(i - 1, 0))}
      onNext={() => setSelectedWeekIndex((i) => Math.min(i + 1, MOCK_WEEKS.length - 1))}
      isPreviousDisabled={!previousWeek}
      isNextDisabled={!nextWeek}
    />
  ) : undefined;

  const heroAction = <ViewSwitch options={VIEW_OPTIONS} value={viewMode} onChange={setViewMode} />;

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

        {isToday ? (
          <section className={styles.lessonList} aria-label="Расписание на сегодня">
            {TODAY_LESSONS.map((lesson) => (
              <ScheduleCard
                key={lesson.id}
                startTime={lesson.startTime}
                endTime={lesson.endTime}
                subjectName={lesson.title}
                lessonType={lesson.type}
                room={lesson.room}
                groups={lesson.groups}
                onMore={() => router.push(`/teacher/lesson/${lesson.id}`)}
                moreLabel={`Действия: ${lesson.title}`}
              />
            ))}
          </section>
        ) : (
          <section className={styles.weekList} aria-label="Расписание на неделю" aria-live="polite">
            {selectedWeek.days.map((day) => (
              <div key={day.id} className={styles.weekDay}>
                <DayDivider label={`${day.label}, ${day.date}`} />
                {day.lessons.length > 0 ? (
                  <div className={styles.dayLessons}>
                    {day.lessons.map((lesson) => (
                      <ScheduleCard
                        key={lesson.id}
                        startTime={lesson.startTime}
                        endTime={lesson.endTime}
                        subjectName={lesson.title}
                        lessonType={lesson.type}
                        room={lesson.room}
                        groups={lesson.groups}
                        onMore={() => router.push(`/teacher/lesson/${lesson.id}`)}
                        moreLabel={`Действия: ${lesson.title}`}
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
