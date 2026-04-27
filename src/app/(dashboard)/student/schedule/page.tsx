'use client';

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
import { LessonCard } from '@/components/shared/LessonCard/LessonCard';
import { formatDateFull, getWeekDay } from '@/lib/utils/formatDate';
import styles from './schedule.module.scss';

const MOCK_DAYS = [
  {
    label: 'Вчера',
    date: '2026-04-22',
    lessons: [
      {
        id: 1,
        startTime: '08:30',
        endTime: '10:00',
        subjectName: 'Базы данных',
        meta: 'Лекция • Сафиуллин Р.Н.',
        room: 'Ауд. 507',
      },
      {
        id: 2,
        startTime: '10:20',
        endTime: '11:45',
        subjectName: 'Дискретная математика',
        meta: 'Практика • Новиков А.В.',
        room: 'Ауд. 408',
      },
    ],
  },
  {
    label: 'Сегодня',
    date: '2026-04-23',
    lessons: [
      {
        id: 3,
        startTime: '10:20',
        endTime: '11:50',
        subjectName: 'Базы данных',
        meta: 'Лекция • Сафиуллин Р.Н.',
        room: 'Ауд. 1101',
        isActive: true,
      },
      {
        id: 4,
        startTime: '12:10',
        endTime: '13:40',
        subjectName: 'Дискретная математика',
        meta: 'Практика • Новиков А.В.',
        room: 'Ауд. 602',
      },
      {
        id: 5,
        startTime: '14:00',
        endTime: '15:30',
        subjectName: 'Программная инженерия',
        meta: 'Лабораторная • Батрушина Г.С.',
        room: 'Ауд. 310',
      },
    ],
  },
  {
    label: 'Завтра',
    date: '2026-04-24',
    lessons: [
      {
        id: 6,
        startTime: '10:20',
        endTime: '11:50',
        subjectName: 'Базы данных',
        meta: 'Практика • Сафиуллин Р.Н.',
        room: 'Ауд. 1101',
      },
    ],
  },
];

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
    subtitle: 'Раздел: Практическая работа №4',
    time: '2 ч назад',
  },
  {
    id: 2,
    icon: <ApartmentRoundedIcon sx={{ fontSize: 28, color: '#2a657e' }} />,
    title: 'Изменена аудитория: Дискретная математика',
    subtitle: 'Новая локация: Ауд. 602 (вместо 604)',
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
    subtitle: 'Преподаватель: Смирнов Д.А.',
    time: '2 дня назад',
  },
];

// TODO: Стоит разбить страницу на блоки, например: Greeting, SchedulePreview, RatingSummary, ChangesList.
//  Старайтесь не писать большие компоненты, которые делают сразу всё.
//  Если у компонента есть несколько логических блоков, лучше разбить его на несколько маленьких
export default function StudentSchedulePage() {
  const { user } = useAuthStore();

  const previousDay = MOCK_DAYS[0];
  const today = MOCK_DAYS[1];
  const nextDay = MOCK_DAYS[2];
  const todayDateStr = formatDateFull(today.date);
  const todayWeekDay = getWeekDay(today.date);
  const avgScore = 74.2;
  const ratingPos = 12;
  const totalStudents = 87;
  const groupName = (user as { groupName?: string })?.groupName ?? '09-411';
  const firstName = user?.firstName ?? 'Тимур';

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.greeting}>
          <div className={styles.greetingBody}>
            <Typography className={styles.greetingTitle}>
              Добрый день, {firstName}
            </Typography>
            <div className={styles.greetingMeta}>
              <span>{todayWeekDay}, {todayDateStr}</span>
              <span className={styles.metaDot}>·</span>
              <span>Неделя 10</span>
              <span className={styles.metaDot}>·</span>
              <strong>{today.lessons.length} занятия сегодня</strong>
            </div>
          </div>

          <Link href="#schedule" className={styles.greetingLink}>
            Перейти в расписание <ArrowForwardIcon sx={{ fontSize: 28 }} />
          </Link>
        </section>

        <section id="schedule" className={styles.scheduleStage}>
          <div className={styles.stageTag}>ПАРЫ СЕГОДНЯ</div>

          <div className={styles.stageLayout}>
            <div className={`${styles.sideColumn} ${styles.sideColumnLeft}`}>
              <div className={styles.sideLabel}>{previousDay.label.toUpperCase()}</div>
              {previousDay.lessons.map((lesson) => (
                <LessonCard key={lesson.id} {...lesson} variant="preview" />
              ))}
            </div>

            <button type="button" className={styles.arrowButton} aria-label="Предыдущий день">
              <ChevronLeftRoundedIcon sx={{ fontSize: 26 }} />
            </button>

            <div className={styles.todayColumn}>
              {today.lessons.map((lesson) => (
                <LessonCard key={lesson.id} {...lesson} variant="hero" />
              ))}
            </div>

            <button type="button" className={styles.arrowButton} aria-label="Следующий день">
              <ChevronRightRoundedIcon sx={{ fontSize: 26 }} />
            </button>

            <div className={`${styles.sideColumn} ${styles.sideColumnRight}`}>
              <div className={styles.sideLabel}>{nextDay.label.toUpperCase()}</div>
              {nextDay.lessons.map((lesson) => (
                <LessonCard key={lesson.id} {...lesson} variant="preview" />
              ))}
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
