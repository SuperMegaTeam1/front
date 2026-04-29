'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { PageHero } from '@/components/ui';
import styles from './subject-detail.module.scss';

type GradeEntry = {
  id: number;
  date: string;
  time: string;
  room: string;
  points: number | null;
};

type SubjectPageData = {
  id: number;
  name: string;
  teacher: string;
  department: string;
  semester: string;
  currentScore: number;
  maxScore: number;
  groupName: string;
  ratingPlace: number;
  totalStudents: number;
  journal: GradeEntry[];
};

const INITIAL_VISIBLE_ROWS = 5;

const SUBJECTS: Record<number, SubjectPageData> = {
  1: {
    id: 1,
    name: 'Математический анализ',
    teacher: 'проф. Иванов И.И.',
    department: 'Кафедра высшей математики',
    semester: 'Семестр 3',
    currentScore: 92,
    maxScore: 100,
    groupName: 'Группа БФ-22-01',
    ratingPlace: 3,
    totalStudents: 28,
    journal: [
      { id: 1, date: '12.10.2023', time: '10:45', room: '402', points: null },
      { id: 2, date: '10.10.2023', time: '09:00', room: '315', points: 5 },
      { id: 3, date: '05.10.2023', time: '14:20', room: '101', points: 18 },
      { id: 4, date: '03.10.2023', time: '12:30', room: '208', points: null },
      { id: 5, date: '28.09.2023', time: '09:00', room: '315', points: 4 },
      { id: 6, date: '26.09.2023', time: '10:45', room: '402', points: 7 },
      { id: 7, date: '21.09.2023', time: '09:00', room: '315', points: 6 },
      { id: 8, date: '19.09.2023', time: '14:20', room: '101', points: 13 },
      { id: 9, date: '14.09.2023', time: '12:30', room: '208', points: 10 },
      { id: 10, date: '12.09.2023', time: '09:00', room: '315', points: null },
    ],
  },
  2: {
    id: 2,
    name: 'Базы данных',
    teacher: 'доц. Сафиуллин Р.Н.',
    department: 'Кафедра информационных систем',
    semester: 'Семестр 3',
    currentScore: 84,
    maxScore: 100,
    groupName: 'Группа БФ-22-01',
    ratingPlace: 7,
    totalStudents: 28,
    journal: [
      { id: 1, date: '15.10.2023', time: '10:20', room: '315', points: 12 },
      { id: 2, date: '08.10.2023', time: '10:20', room: '315', points: 10 },
      { id: 3, date: '01.10.2023', time: '10:20', room: '315', points: 8 },
      { id: 4, date: '24.09.2023', time: '10:20', room: '315', points: null },
      { id: 5, date: '17.09.2023', time: '10:20', room: '315', points: 6 },
      { id: 6, date: '10.09.2023', time: '10:20', room: '315', points: 9 },
      { id: 7, date: '03.09.2023', time: '10:20', room: '315', points: 11 },
    ],
  },
  3: {
    id: 3,
    name: 'Дискретная математика',
    teacher: 'доц. Новиков А.В.',
    department: 'Кафедра прикладной математики',
    semester: 'Семестр 3',
    currentScore: 76,
    maxScore: 100,
    groupName: 'Группа БФ-22-01',
    ratingPlace: 11,
    totalStudents: 28,
    journal: [
      { id: 1, date: '13.10.2023', time: '12:10', room: '208', points: 10 },
      { id: 2, date: '06.10.2023', time: '12:10', room: '208', points: 9 },
      { id: 3, date: '29.09.2023', time: '12:10', room: '208', points: null },
      { id: 4, date: '22.09.2023', time: '12:10', room: '208', points: 8 },
      { id: 5, date: '15.09.2023', time: '12:10', room: '208', points: 7 },
      { id: 6, date: '08.09.2023', time: '12:10', room: '208', points: 6 },
      { id: 7, date: '01.09.2023', time: '12:10', room: '208', points: 12 },
    ],
  },
  4: {
    id: 4,
    name: 'Программная инженерия',
    teacher: 'ст. преп. Батрушина Г.С.',
    department: 'Кафедра программной инженерии',
    semester: 'Семестр 3',
    currentScore: 88,
    maxScore: 100,
    groupName: 'Группа БФ-22-01',
    ratingPlace: 5,
    totalStudents: 28,
    journal: [
      { id: 1, date: '16.10.2023', time: '14:00', room: '310', points: 14 },
      { id: 2, date: '09.10.2023', time: '14:00', room: '310', points: 12 },
      { id: 3, date: '02.10.2023', time: '14:00', room: '310', points: 11 },
      { id: 4, date: '25.09.2023', time: '14:00', room: '310', points: 9 },
      { id: 5, date: '18.09.2023', time: '14:00', room: '310', points: null },
      { id: 6, date: '11.09.2023', time: '14:00', room: '310', points: 8 },
      { id: 7, date: '04.09.2023', time: '14:00', room: '310', points: 15 },
    ],
  },
};

const FALLBACK_SUBJECT: SubjectPageData = {
  id: 0,
  name: 'Предмет',
  teacher: 'преп. Не указан',
  department: 'Кафедра не указана',
  semester: 'Семестр 3',
  currentScore: 0,
  maxScore: 100,
  groupName: 'Группа БФ-22-01',
  ratingPlace: 0,
  totalStudents: 0,
  journal: [],
};

export default function StudentSubjectDetailPage() {
  const params = useParams<{ id: string }>();
  const subjectId = Number(params?.id ?? 0);
  const subject = useMemo(() => SUBJECTS[subjectId] ?? FALLBACK_SUBJECT, [subjectId]);
  const [isExpanded, setIsExpanded] = useState(false);

  const progressWidth = `${Math.min(100, Math.max(0, (subject.currentScore / subject.maxScore) * 100))}%`;
  const hasExtraRows = subject.journal.length > INITIAL_VISIBLE_ROWS;
  const visibleEntries = isExpanded ? subject.journal : subject.journal.slice(0, INITIAL_VISIBLE_ROWS);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero
          title={subject.name}
          subtitle={`${subject.teacher} · ${subject.department}`}
        />

        <section className={styles.summaryGrid}>
          <article className={styles.progressCard}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>Текущая успеваемость</h2>
              <span className={styles.semesterBadge}>{subject.semester}</span>
            </div>

            <div className={styles.scoreRow}>
              <span className={styles.scoreValue}>{subject.currentScore}</span>
              <span className={styles.scoreMax}>/ {subject.maxScore} баллов</span>
            </div>

            <div className={styles.progressTrack} aria-hidden="true">
              <div className={styles.progressFill} style={{ width: progressWidth }} />
            </div>
          </article>

          <article className={styles.ratingCard}>
            <h2 className={styles.ratingTitle}>Рейтинг группы</h2>
            <p className={styles.ratingSubtitle}>{subject.groupName}</p>

            <div className={styles.ratingValueRow}>
              <span className={styles.ratingValue}>{subject.ratingPlace}</span>
              <span className={styles.ratingSuffix}>-е</span>
            </div>

            <p className={styles.ratingCaption}>место среди {subject.totalStudents} студентов</p>
          </article>
        </section>

        <section className={styles.journalSection}>
          <h2 className={styles.journalTitle}>Журнал баллов</h2>

          <div className={styles.tableHeader}>
            <span>Дата</span>
            <span>Время</span>
            <span>Баллы</span>
          </div>

          <div className={styles.rows}>
            {visibleEntries.map((entry) => (
              <article key={entry.id} className={styles.row}>
                <span className={`${styles.rowCell} ${styles.dateCell}`}>{entry.date}</span>
                <span className={`${styles.rowCell} ${styles.timeCell}`}>{entry.time}</span>
                <span className={`${styles.rowCell} ${styles.points} ${entry.points === null ? styles.emptyScore : ''}`}>
                  {entry.points === null ? '—' : entry.points}
                </span>
              </article>
            ))}
          </div>

          {hasExtraRows && (
            <button
              type="button"
              className={`${styles.historyLink} ${isExpanded ? styles.historyLinkExpanded : ''}`}
              onClick={() => setIsExpanded((isOpen) => !isOpen)}
            >
              {isExpanded ? 'Скрыть историю' : 'Показать всю историю'}
              <KeyboardArrowDownRoundedIcon sx={{ fontSize: 18 }} />
            </button>
          )}
        </section>
      </div>
    </div>
  );
}
