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
import { formatDateFull, getWeekDay } from '@/lib/utils/formatDate';
import { buildWeek, WEEK_BASE_NUMBER } from '../schedule/scheduleData';
import styles from './home.module.scss';

type HomeLesson = LessonCardProps & {
  id: number;
};

type HomeScheduleDay = {
  date: string;
  lessons: HomeLesson[];
};

const TODAY_INDEX = 1;

const MOCK_DAYS: HomeScheduleDay[] = buildWeek(0).map((day) => ({
  date: day.date,
  lessons: day.lessons.map((lesson) => ({
    id: lesson.id,
    startTime: lesson.startTime,
    endTime: lesson.endTime,
    subjectName: lesson.subjectName,
    meta: `${lesson.lessonType} • ${lesson.teacherName}`,
    room: lesson.room,
  })),
}));

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

function getRelativeDayLabel(offset: number) {
  if (offset === 0) {
    return 'Сегодня';
  }

  if (offset === -1) {
    return 'Вчера';
  }

  if (offset === 1) {
    return 'Завтра';
  }

  return getWeekDay(MOCK_DAYS[TODAY_INDEX + offset]?.date ?? MOCK_DAYS[TODAY_INDEX].date);
}

function getStageTag(index: number) {
  const offset = index - TODAY_INDEX;

  if (offset === 0) {
    return 'ПАРЫ СЕГОДНЯ';
  }

  if (offset === -1) {
    return 'ПАРЫ ВЧЕРА';
  }

  if (offset === 1) {
    return 'ПАРЫ ЗАВТРА';
  }

  return `РАСПИСАНИЕ НА ${getWeekDay(MOCK_DAYS[index].date).toUpperCase()}`;
}

function EmptyDay({ isCompact = false }: { isCompact?: boolean }) {
  return (
    <div className={isCompact ? styles.emptyPreview : styles.emptyState}>
      <span>Пар нет</span>
    </div>
  );
}

export default function StudentHomePage() {
  const { user } = useAuthStore();
  const [currentDayIndex, setCurrentDayIndex] = useState(TODAY_INDEX);

  const currentDay = MOCK_DAYS[currentDayIndex];
  const previousDay = MOCK_DAYS[currentDayIndex - 1];
  const nextDay = MOCK_DAYS[currentDayIndex + 1];

  const currentDateStr = formatDateFull(currentDay.date);
  const currentWeekDay = getWeekDay(currentDay.date);
  const currentDayLabel = getRelativeDayLabel(currentDayIndex - TODAY_INDEX);
  const avgScore = 74.2;
  const ratingPos = 12;
  const totalStudents = 87;
  const groupName = (user as { groupName?: string })?.groupName ?? '09-411';
  const firstName = user?.firstName ?? 'Тимур';
  const weekNumber = WEEK_BASE_NUMBER;

  const lessonsCountLabel = useMemo(() => {
    const count = currentDay.lessons.length;

    if (count === 1) {
      return '1 занятие';
    }

    if (count >= 2 && count <= 4) {
      return `${count} занятия`;
    }

    return `${count} занятий`;
  }, [currentDay.lessons.length]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.greeting}>
          <div className={styles.greetingBody}>
            <Typography className={styles.greetingTitle}>
              Добрый день, {firstName}
            </Typography>
            <div className={styles.greetingMeta}>
              <span>{currentWeekDay}, {currentDateStr}</span>
              <span className={styles.metaDot}>•</span>
              <span>Неделя {weekNumber}</span>
              <span className={styles.metaDot}>•</span>
              <strong>{lessonsCountLabel} {currentDayLabel.toLowerCase()}</strong>
            </div>
          </div>

          <Link href="/student/schedule" className={styles.greetingLink}>
            Перейти в расписание <ArrowForwardIcon sx={{ fontSize: 28 }} />
          </Link>
        </section>

        <section id="schedule" className={styles.scheduleStage}>
          <div className={styles.stageTag}>{getStageTag(currentDayIndex)}</div>

          <div className={styles.stageLayout}>
            <div className={`${styles.sideColumn} ${styles.sideColumnLeft}`}>
              {previousDay ? (
                <>
                  <div className={styles.sideLabel}>{getRelativeDayLabel(currentDayIndex - TODAY_INDEX - 1).toUpperCase()}</div>
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
              onClick={() => setCurrentDayIndex((index) => Math.max(0, index - 1))}
              disabled={currentDayIndex === 0}
            >
              <ChevronLeftRoundedIcon sx={{ fontSize: 26 }} />
            </button>

            <div className={styles.todayColumn}>
              {currentDay.lessons.length > 0 ? (
                currentDay.lessons.map((lesson) => (
                  <LessonCard key={lesson.id} {...lesson} variant="hero" />
                ))
              ) : (
                <EmptyDay />
              )}
            </div>

            <button
              type="button"
              className={styles.arrowButton}
              aria-label="Показать следующий день"
              onClick={() => setCurrentDayIndex((index) => Math.min(MOCK_DAYS.length - 1, index + 1))}
              disabled={currentDayIndex === MOCK_DAYS.length - 1}
            >
              <ChevronRightRoundedIcon sx={{ fontSize: 26 }} />
            </button>

            <div className={`${styles.sideColumn} ${styles.sideColumnRight}`}>
              {nextDay ? (
                <>
                  <div className={styles.sideLabel}>{getRelativeDayLabel(currentDayIndex - TODAY_INDEX + 1).toUpperCase()}</div>
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
