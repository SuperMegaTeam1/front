'use client';

import Link from 'next/link';
import { LessonCard } from '@/components/shared/LessonCard/LessonCard';
import { SubjectCard } from '@/components/shared/SubjectCard/SubjectCard';
import styles from './schedule.module.scss';

/* ── Figma asset URLs (7-day expiry) ── */
const ICON_ARROW = 'https://www.figma.com/api/mcp/asset/f742800a-a241-484e-9ed2-ee5537dffa0e';
const ICON_CHEVRON_LEFT = 'https://www.figma.com/api/mcp/asset/446173d0-1c1a-47e8-98f4-e827fc0dec86';
const ICON_CHEVRON_RIGHT = 'https://www.figma.com/api/mcp/asset/bb30df76-40e5-4b8d-94fa-3c24b3e8fed4';

/* ── Stub data (will be replaced by API) ── */
const TEACHER_NAME = 'Дмитрий Александрович';

const todayLessons = [
  { timeStart: '10:20', timeEnd: '11:50', subject: 'Базы данных', type: 'Лекция', groups: '09-352, 09-353.', room: 'Ауд. 1101' },
  { timeStart: '12:10', timeEnd: '13:40', subject: 'Дискретная математика', type: 'Практика', groups: '09-234.', room: 'Ауд. 602' },
  { timeStart: '14:00', timeEnd: '15:30', subject: 'Программная инженерия', type: 'Практика', groups: '08-222.', room: 'Ауд. 310' },
];

const yesterdayLessons = [
  { timeStart: '10:20', timeEnd: '11:50', subject: 'Базы данных', type: 'Лекция', groups: '09-352', room: '' },
  { timeStart: '12:10', timeEnd: '13:40', subject: 'математика', type: 'Практика', groups: '09-251', room: '' },
];

const tomorrowLessons = [
  { timeStart: '10:20', timeEnd: '11:50', subject: 'Базы данных', type: 'Лекция', groups: '09-352', room: '' },
  { timeStart: '12:10', timeEnd: '13:40', subject: 'Практика', type: 'Практика', groups: '09-251', room: '' },
];

const subjects = [
  { id: 1, name: 'Математический анализ', groups: 'Группы: 09-351, 09-352', examType: 'ЭКЗАМЕН' as const, iconUrl: 'https://www.figma.com/api/mcp/asset/b97cccdc-1e8b-47a8-b5a5-b8b6f8dbe573', iconBg: '#bfe8ff' },
  { id: 2, name: 'Дискретная математика', groups: 'Группы: 09-251, 09-252', examType: 'ЗАЧЕТ' as const, iconUrl: 'https://www.figma.com/api/mcp/asset/1953c1fe-2236-4ea7-9298-b739fef1285d', iconBg: '#c7d9f3' },
  { id: 3, name: 'Программная инженерия', groups: 'Группа: 09-351', examType: 'ЭКЗАМЕН' as const, iconUrl: 'https://www.figma.com/api/mcp/asset/15e2788a-9007-4c95-99a9-97aec1b6c068', iconBg: '#d6e5ec' },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Доброе утро';
  if (hour < 17) return 'Добрый день';
  return 'Добрый вечер';
}

function getDateString(): string {
  const now = new Date();
  const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
}

export default function TeacherSchedulePage() {
  return (
    <div className={styles.page}>
      {/* ── Hero / Day Status Block ── */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.greeting}>
            {getGreeting()}, {TEACHER_NAME}
          </h1>
          <p className={styles.dateLine}>
            {getDateString()} · Неделя 10 · <strong>{todayLessons.length} занятия сегодня</strong>
          </p>
        </div>
        <Link href="/teacher/schedule" className={styles.scheduleLink}>
          Перейти в расписание
          <img src={ICON_ARROW} alt="" width={16} height={16} />
        </Link>
      </section>

      {/* ── Schedule Carousel ── */}
      <section className={styles.carousel}>
        <div className={styles.carouselInner}>
          {/* Yesterday */}
          <div className={styles.sideDay}>
            <span className={styles.dayLabel}>ВЧЕРА</span>
            <div className={styles.sideLessons}>
              {yesterdayLessons.map((l, i) => (
                <LessonCard key={i} {...l} dimmed compact />
              ))}
            </div>
          </div>

          {/* Prev button */}
          <button type="button" className={styles.carouselBtn} aria-label="Предыдущий день">
            <img src={ICON_CHEVRON_LEFT} alt="" width={7} height={12} />
          </button>

          {/* Today */}
          <div className={styles.today}>
            <div className={styles.todayLabel}>
              <span>ПАРЫ СЕГОДНЯ</span>
            </div>
            <div className={styles.todayCards}>
              {todayLessons.map((l, i) => (
                <LessonCard key={i} {...l} />
              ))}
            </div>
          </div>

          {/* Next button */}
          <button type="button" className={styles.carouselBtn} aria-label="Следующий день">
            <img src={ICON_CHEVRON_RIGHT} alt="" width={7} height={12} />
          </button>

          {/* Tomorrow */}
          <div className={styles.sideDay}>
            <span className={styles.dayLabel}>ЗАВТРА</span>
            <div className={styles.sideLessons}>
              {tomorrowLessons.map((l, i) => (
                <LessonCard key={i} {...l} dimmed compact />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── My Subjects ── */}
      <section className={styles.subjects}>
        <div className={styles.subjectsHeader}>
          <h2 className={styles.subjectsTitle}>Мои предметы</h2>
          <Link href="/teacher/subjects" className={styles.subjectsAll}>
            Все предметы
          </Link>
        </div>
        <div className={styles.subjectsGrid}>
          {subjects.map((s) => (
            <SubjectCard key={s.id} {...s} />
          ))}
        </div>
      </section>
    </div>
  );
}
