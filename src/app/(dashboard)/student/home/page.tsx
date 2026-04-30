'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import AddchartRoundedIcon from '@mui/icons-material/AddchartRounded';
import ApartmentRoundedIcon from '@mui/icons-material/ApartmentRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import { useAuthStore } from '@/stores/useAuthStore';
import { LessonCard, type LessonCardProps } from '@/components/shared/LessonCard/LessonCard';
import { PageHero, ScheduleCard } from '@/components/ui';
import { formatDateFull, getWeekDay } from '@/lib/utils/formatDate';
import { useWeekSchedule } from '@/lib/hooks/useSchedule';
import type { ScheduleLessonResult, WeekScheduleResult } from '@/lib/api/types';
import styles from './home.module.scss';

type HomeLesson = LessonCardProps & {
  id: string;
};

type HomeScheduleDay = {
  date: string;
  lessons: HomeLesson[];
};

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

function getLocalIsoDate(date = new Date()) {
  const timezoneOffset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

function parseIsoDate(dateStr: string) {
  return new Date(`${dateStr}T12:00:00`);
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function shiftIsoDate(dateStr: string, days: number) {
  const date = parseIsoDate(dateStr);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

function getWeekStart(dateStr: string) {
  const date = parseIsoDate(dateStr);
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return toIsoDate(date);
}

function buildEmptyWeek(anchorDate: string): HomeScheduleDay[] {
  const monday = getWeekStart(anchorDate);

  return Array.from({ length: 6 }, (_, index) => ({
    date: shiftIsoDate(monday, index),
    lessons: [],
  }));
}

function getIsoWeekNumber(dateStr: string) {
  const date = parseIsoDate(dateStr);
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNumber = target.getUTCDay() || 7;

  target.setUTCDate(target.getUTCDate() + 4 - dayNumber);

  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));

  return Math.ceil((((target.getTime() - yearStart.getTime()) / 86_400_000) + 1) / 7);
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

function getRelativeDayLabel(offset: number, fallbackDate: string) {
  if (offset === 0) {
    return 'Сегодня';
  }

  if (offset === -1) {
    return 'Вчера';
  }

  if (offset === 1) {
    return 'Завтра';
  }

  return getWeekDay(fallbackDate);
}

function getStageTag(index: number, todayIndex: number, date: string) {
  const offset = index - todayIndex;

  if (offset === 0) {
    return 'ПАРЫ СЕГОДНЯ';
  }

  if (offset === -1) {
    return 'ПАРЫ ВЧЕРА';
  }

  if (offset === 1) {
    return 'ПАРЫ ЗАВТРА';
  }

  return `РАСПИСАНИЕ НА ${getWeekDay(date).toUpperCase()}`;
}

function parseLessonMeta(meta?: string) {
  if (!meta) {
    return {};
  }

  const [lessonType, teacherName] = meta.split(' • ');

  return {
    lessonType,
    teacherName,
  };
}

function EmptyDay({
  isCompact = false,
  title = 'Пар нет',
}: {
  isCompact?: boolean;
  title?: string;
}) {
  return (
    <div className={isCompact ? styles.emptyPreview : styles.emptyState}>
      <span>{title}</span>
    </div>
  );
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
  const currentDayLabel = getRelativeDayLabel(currentDayIndex - todayIndex, currentDay.date);
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
            <Link href="/student/schedule" className={styles.greetingLink}>
              Перейти в расписание <ArrowForwardIcon sx={{ fontSize: 22 }} />
            </Link>
          }
        />

        <section id="schedule" className={styles.scheduleStage}>
          <div className={styles.stageTag}>{getStageTag(currentDayIndex, todayIndex, currentDay.date)}</div>

          <div className={styles.stageLayout}>
            <div className={`${styles.sideColumn} ${styles.sideColumnLeft}`}>
              {previousDay ? (
                <>
                  <div className={styles.sideLabel}>
                    {getRelativeDayLabel(currentDayIndex - todayIndex - 1, previousDay.date).toUpperCase()}
                  </div>
                  {previousDay.lessons.length > 0 ? (
                    previousDay.lessons.map((lesson) => (
                      <LessonCard key={lesson.id} {...lesson} variant="preview" />
                    ))
                  ) : (
                    <EmptyDay isCompact />
                  )}
                </>
              ) : null}
            </div>

            <button
              type="button"
              className={styles.arrowButton}
              aria-label="Показать предыдущий день"
              onClick={() => setSelectedDayIndex((index) => Math.max(0, (index ?? currentDayIndex) - 1))}
              disabled={currentDayIndex === 0}
            >
              <ChevronLeftRoundedIcon sx={{ fontSize: 26 }} />
            </button>

            <div className={styles.todayColumn}>
              {isWeekScheduleLoading ? (
                <EmptyDay title="Загружаем расписание" />
              ) : weekScheduleError ? (
                <EmptyDay title="Не удалось загрузить расписание" />
              ) : currentDay.lessons.length > 0 ? (
                currentDay.lessons.map((lesson) => {
                  const { lessonType, teacherName } = parseLessonMeta(lesson.meta);

                  return (
                    <ScheduleCard
                      key={lesson.id}
                      startTime={lesson.startTime}
                      endTime={lesson.endTime}
                      subjectName={lesson.subjectName}
                      lessonType={lessonType}
                      teacherName={teacherName}
                      room={lesson.room}
                    />
                  );
                })
              ) : (
                <EmptyDay />
              )}
            </div>

            <button
              type="button"
              className={styles.arrowButton}
              aria-label="Показать следующий день"
              onClick={() => setSelectedDayIndex((index) => Math.min(weekDays.length - 1, (index ?? currentDayIndex) + 1))}
              disabled={currentDayIndex === weekDays.length - 1}
            >
              <ChevronRightRoundedIcon sx={{ fontSize: 26 }} />
            </button>

            <div className={`${styles.sideColumn} ${styles.sideColumnRight}`}>
              {nextDay ? (
                <>
                  <div className={styles.sideLabel}>
                    {getRelativeDayLabel(currentDayIndex - todayIndex + 1, nextDay.date).toUpperCase()}
                  </div>
                  {nextDay.lessons.length > 0 ? (
                    nextDay.lessons.map((lesson) => (
                      <LessonCard key={lesson.id} {...lesson} variant="preview" />
                    ))
                  ) : (
                    <EmptyDay isCompact />
                  )}
                </>
              ) : null}
            </div>
          </div>
        </section>

        <section className={styles.insightsSection}>
          <Typography className={styles.sectionTitle}>Успеваемость и рейтинг</Typography>

          <div className={styles.insightsCard}>
            <div className={styles.primaryStat}>
              <div className={styles.primaryScore}>{avgScore}</div>
              <div className={styles.primaryLabel}>СРЕДНИЙ БАЛЛ</div>
              <Link href="/student/rating" className={styles.primaryLink}>
                Смотреть подробный рейтинг <ArrowForwardIcon sx={{ fontSize: 22 }} />
              </Link>
            </div>

            <div className={styles.secondaryStat}>
              <div className={styles.secondaryValue}>{ratingPos} из {totalStudents}</div>
              <div className={styles.secondaryLabel}>Группа {groupName}</div>
            </div>

            <div className={styles.subjectScores}>
              {MOCK_GRADES.map((grade) => (
                <div
                  key={grade.subject}
                  className={`${styles.subjectScoreRow} ${grade.score < 70 ? styles.subjectScoreRowDim : ''}`}
                >
                  <span>{grade.subject}</span>
                  <strong>{grade.score}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.changesSection}>
          <Typography className={styles.sectionTitle}>Последние изменения</Typography>

          <div className={styles.changesCard}>
            {MOCK_NOTIFICATIONS.map((notification, index) => (
              <article
                key={notification.id}
                className={`${styles.changeItem} ${index < MOCK_NOTIFICATIONS.length - 1 ? styles.changeItemBorder : ''}`}
              >
                <div className={styles.changeIcon}>{notification.icon}</div>
                <div className={styles.changeBody}>
                  <p className={styles.changeTitle}>{notification.title}</p>
                  <p className={styles.changeSubtitle}>{notification.subtitle}</p>
                </div>
                <span className={styles.changeTime}>{notification.time}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
