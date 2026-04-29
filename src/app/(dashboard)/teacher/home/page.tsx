'use client';

import Link from 'next/link';
import { Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import { useAuthStore } from '@/stores/useAuthStore';
import { LessonCard } from '@/components/shared/LessonCard/LessonCard';
import { SubjectCard } from '@/components/shared/SubjectCard/SubjectCard';
import { PageHero } from '@/components/ui';
import { formatDateFull, getWeekDay } from '@/lib/utils/formatDate';
import styles from './home.module.scss';

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
        meta: 'Лекция • 09-351, 09-352.',
        room: 'Ауд. 1005',
      },
      {
        id: 2,
        startTime: '10:15',
        endTime: '11:45',
        subjectName: 'Дискретная математика',
        meta: 'Практика • 09-234.',
        room: 'Ауд. 602',
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
        meta: 'Лекция • 09-352, 09-353.',
        room: 'Ауд. 1101',
        isActive: true,
      },
      {
        id: 4,
        startTime: '12:10',
        endTime: '13:40',
        subjectName: 'Дискретная математика',
        meta: 'Практика • 09-234.',
        room: 'Ауд. 602',
      },
      {
        id: 5,
        startTime: '14:00',
        endTime: '15:30',
        subjectName: 'Программная инженерия',
        meta: 'Практика • 08-222.',
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
        meta: 'Лекция • 09-352, 09-353.',
        room: 'Ауд. 1101',
      },
      {
        id: 7,
        startTime: '12:10',
        endTime: '13:40',
        subjectName: 'Практикум',
        meta: 'Группа • 09-251.',
        room: 'Ауд. 518',
      },
    ],
  },
];

const MOCK_SUBJECTS = [
  {
    id: 1,
    name: 'Математический анализ',
    examType: 'ЭКЗАМЕН' as const,
    groups: ['09-351', '09-352'],
    icon: <CalculateOutlinedIcon sx={{ fontSize: 34, color: '#2a657e' }} />,
    iconVariant: 'brand' as const,
  },
  {
    id: 2,
    name: 'Дискретная математика',
    examType: 'ЗАЧЕТ' as const,
    groups: ['09-251', '09-252'],
    icon: <HubOutlinedIcon sx={{ fontSize: 34, color: '#2a657e' }} />,
    iconVariant: 'violet' as const,
  },
  {
    id: 3,
    name: 'Программная инженерия',
    examType: 'ЭКЗАМЕН' as const,
    groups: ['09-351'],
    icon: <CodeOutlinedIcon sx={{ fontSize: 34, color: '#2a657e' }} />,
    iconVariant: 'mint' as const,
  },
];

export default function TeacherSchedulePage() {
  const { user } = useAuthStore();

  const previousDay = MOCK_DAYS[0];
  const today = MOCK_DAYS[1];
  const nextDay = MOCK_DAYS[2];
  const todayLessonsCount = today.lessons.length;
  const todayDateStr = formatDateFull(today.date);
  const todayWeekDay = getWeekDay(today.date);
  const firstName = user?.firstName ?? 'Дмитрий';
  const patronymic = user?.patronymic ?? 'Александрович';
  const fullGreeting = `${firstName} ${patronymic}`.trim();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero
          title={`Добрый день, ${fullGreeting}`}
          meta={
            <>
              <span>{todayWeekDay}, {todayDateStr}</span>
              <span>·</span>
              <span>Неделя 10</span>
              <span>·</span>
              <strong style={{ color: '#2a657e' }}>{todayLessonsCount} занятия сегодня</strong>
            </>
          }
          action={
            <Link href="#schedule" className={styles.greetingLink}>
              Перейти в расписание <ArrowForwardIcon sx={{ fontSize: 22 }} />
            </Link>
          }
        />

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

        <section className={styles.subjectSection}>
          <div className={styles.sectionHeader}>
            <Typography className={styles.sectionTitle}>Мои предметы</Typography>
            <Link href="/teacher/subjects" className={styles.sectionLink}>
              Все предметы
            </Link>
          </div>

          <div className={styles.subjectsGrid}>
            {MOCK_SUBJECTS.map((subject) => (
              <SubjectCard
                key={subject.id}
                {...subject}
                href="/teacher/subjects"
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
