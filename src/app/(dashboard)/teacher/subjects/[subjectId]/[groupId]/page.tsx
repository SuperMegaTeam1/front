'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { PageHero } from '@/components/ui';
import styles from './gradebook.module.scss';

type GradeValue = '2' | '3' | '4' | '5' | 'Н' | 'У' | '—' | '';

interface StudentGradeRow {
  initials: string;
  name: string;
  avatarTone: 'violet' | 'blue' | 'sky' | 'lilac' | 'gray';
  grades: GradeValue[];
  total: number;
}

const DATES_PER_MOBILE_PAGE = 2;

const SUBJECT_TITLES: Record<string, string> = {
  'mathematical-analysis': 'Математический анализ',
  'discrete-math': 'Дискретная математика',
  'software-engineering': 'Программная инженерия',
};

const LESSON_DATES = ['03.04', '10.04', '13.04', '20.04', '27.04', '04.05', '11.05', '18.05', '25.05'];

const STUDENTS: StudentGradeRow[] = [
  {
    initials: 'АА',
    name: 'Александров Артем',
    avatarTone: 'violet',
    grades: ['5', '4', 'У', '5', '', '5', '—', '—', '—'],
    total: 18,
  },
  {
    initials: 'БЕ',
    name: 'Белова Елена',
    avatarTone: 'blue',
    grades: ['4', '5', '5', '5', '', '5', '—', '—', '—'],
    total: 24,
  },
  {
    initials: 'ГД',
    name: 'Григорьев Дмитрий',
    avatarTone: 'sky',
    grades: ['3', '', '', 'У', '', '3', '—', '—', '—'],
    total: 13,
  },
  {
    initials: 'ИС',
    name: 'Иванова Софья',
    avatarTone: 'lilac',
    grades: ['5', '5', '5', '5', '', '5', '—', '—', '—'],
    total: 24,
  },
  {
    initials: 'КМ',
    name: 'Кузнецов Максим',
    avatarTone: 'gray',
    grades: ['У', 'У', '2', '3', '', '2', '—', '—', '—'],
    total: 8,
  },
];

const getGradeClassName = (grade: GradeValue) => {
  if (grade === 'Н' || grade === 'У') {
    return `${styles.gradeCell} ${styles.gradeCellAbsent}`;
  }

  return styles.gradeCell;
};

export default function TeacherGroupGradebookPage() {
  const params = useParams<{ subjectId: string; groupId: string }>();
  const subjectId = params.subjectId ?? 'mathematical-analysis';
  const groupId = params.groupId ?? '09-352';
  const subjectTitle = SUBJECT_TITLES[subjectId] ?? 'Математический анализ';
  const mobilePageCount = Math.ceil(LESSON_DATES.length / DATES_PER_MOBILE_PAGE);
  const [mobilePageIndex, setMobilePageIndex] = useState(0);
  const visibleDateStart = mobilePageIndex * DATES_PER_MOBILE_PAGE;
  const visibleDates = LESSON_DATES.slice(visibleDateStart, visibleDateStart + DATES_PER_MOBILE_PAGE);

  const goToPreviousDates = () => {
    setMobilePageIndex((current) => Math.max(0, current - 1));
  };

  const goToNextDates = () => {
    setMobilePageIndex((current) => Math.min(mobilePageCount - 1, current + 1));
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <PageHero
          className={styles.gradebookHero}
          title={`Журнал группы ${groupId}`}
          subtitle={`${subjectTitle} — 3 семестр`}
        />

        <section
          className={`${styles.gradebookCard} ${styles.desktopGradebook}`}
          aria-label={`Журнал оценок группы ${groupId}`}
        >
          <div className={styles.tableHeader}>
            <div className={styles.studentHeader}>ФИО студента</div>
            {LESSON_DATES.map((date) => (
              <div key={date} className={styles.dateHeader}>{date}</div>
            ))}
            <div className={styles.totalHeader}>Всего<br />баллов</div>
          </div>

          <div className={styles.tableBody}>
            {STUDENTS.map((student) => (
              <div key={student.name} className={styles.tableRow}>
                <div className={styles.studentCell}>
                  <span className={`${styles.avatar} ${styles[student.avatarTone]}`}>{student.initials}</span>
                  <span className={styles.studentName}>{student.name}</span>
                </div>

                {student.grades.map((grade, index) => (
                  <div key={`${student.name}-${LESSON_DATES[index]}`} className={styles.markSlot}>
                    <span className={getGradeClassName(grade)}>{grade}</span>
                  </div>
                ))}

                <div className={styles.totalCell}>{student.total}</div>
              </div>
            ))}
          </div>
        </section>

        <section
          className={`${styles.gradebookCard} ${styles.mobileGradebook}`}
          aria-label={`Мобильный журнал оценок группы ${groupId}`}
        >
          <div className={styles.mobileTableHeader}>
            <div className={styles.mobileStudentHeader}>ФИО студента</div>
            {visibleDates.map((date) => (
              <div key={date} className={styles.mobileDateHeader}>{date}</div>
            ))}
          </div>

          <div className={styles.mobileTableBody}>
            {STUDENTS.map((student) => (
              <div key={student.name} className={styles.mobileTableRow}>
                <div className={styles.mobileStudentCell}>
                  <span className={`${styles.avatar} ${styles[student.avatarTone]}`}>{student.initials}</span>
                  <span className={styles.mobileStudentName}>{student.name}</span>
                </div>

                {visibleDates.map((date, index) => {
                  const grade = student.grades[visibleDateStart + index] ?? '';

                  return (
                    <div key={`${student.name}-${date}`} className={styles.mobileMarkSlot}>
                      <span className={getGradeClassName(grade)}>{grade}</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className={styles.mobilePagination} aria-label="Переключение дат журнала">
            <button
              type="button"
              className={styles.paginationButton}
              onClick={goToPreviousDates}
              disabled={mobilePageIndex === 0}
              aria-label="Предыдущие даты"
            >
              <ChevronLeftRoundedIcon sx={{ fontSize: 34 }} />
            </button>
            <span className={styles.paginationPage}>{mobilePageIndex + 1}</span>
            <button
              type="button"
              className={styles.paginationButton}
              onClick={goToNextDates}
              disabled={mobilePageIndex === mobilePageCount - 1}
              aria-label="Следующие даты"
            >
              <ChevronRightRoundedIcon sx={{ fontSize: 34 }} />
            </button>
          </div>
        </section>

        <div className={styles.actions}>
          <button type="button" className={styles.sendButton}>
            Отправить баллы
            <SendRoundedIcon sx={{ fontSize: 34 }} />
          </button>
        </div>

        <section className={styles.summaryGrid} aria-label={`Сводка по группе ${groupId}`}>
          <article className={`${styles.summaryCard} ${styles.averageCard}`}>
            <h2>Средний балл</h2>
            <strong>67.3</strong>
            <div className={styles.progressTrack}>
              <span className={styles.progressFill} />
            </div>
          </article>

          <article className={styles.summaryCard}>
            <h2>Посещаемость</h2>
            <strong>92%</strong>
            <p>+3% к прошлой неделе</p>
          </article>

          <article className={`${styles.summaryCard} ${styles.nextLessonCard}`}>
            <div className={styles.nextLessonIcon}>
              <CalendarMonthOutlinedIcon sx={{ fontSize: 34 }} />
            </div>
            <div>
              <h2>Следующее занятие</h2>
              <p>04.05.2024 • 09:00 • Ауд. 302</p>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
