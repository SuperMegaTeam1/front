import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { PageHero } from '@/components/ui';
import styles from './gradebook.module.scss';

type GradeValue = '2' | '3' | '4' | '5' | 'Н' | '—' | '';

interface StudentGradeRow {
  initials: string;
  name: string;
  avatarTone: 'violet' | 'blue' | 'sky' | 'lilac' | 'gray';
  grades: GradeValue[];
  total: number;
}

const LESSON_DATES = ['03.04', '10.04', '13.04', '20.04', '27.04', '04.05', '11.05', '18.05', '25.05'];

const STUDENTS: StudentGradeRow[] = [
  {
    initials: 'АА',
    name: 'Александров Артем',
    avatarTone: 'violet',
    grades: ['5', '', 'Н', '5', '', '5', '—', '—', '—'],
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
    grades: ['3', '4', '', 'Н', '', '3', '—', '—', '—'],
    total: 13,
  },
  {
    initials: 'ИС',
    name: 'Иванова Софья',
    avatarTone: 'lilac',
    grades: ['5', '', '5', '5', '', '5', '—', '—', '—'],
    total: 24,
  },
  {
    initials: 'КМ',
    name: 'Кузнецов Максим',
    avatarTone: 'gray',
    grades: ['Н', 'Н', '2', '3', '', '2', '—', '—', '—'],
    total: 8,
  },
];

const getGradeClassName = (grade: GradeValue) => {
  if (grade === 'Н') {
    return `${styles.gradeCell} ${styles.gradeCellAbsent}`;
  }

  return styles.gradeCell;
};

export default function TeacherGroupGradebookPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <PageHero title="Журнал группы 09-352" subtitle="Математический анализ — 3 семестр" />

        <section className={styles.gradebookCard} aria-label="Журнал оценок группы 09-352">
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

        <div className={styles.actions}>
          <button type="button" className={styles.sendButton}>
            Отправить баллы
            <SendRoundedIcon sx={{ fontSize: 34 }} />
          </button>
        </div>

        <section className={styles.summaryGrid} aria-label="Сводка по группе">
          <article className={`${styles.summaryCard} ${styles.averageCard}`}>
            <h2>Средний балл</h2>
            <strong>4.2</strong>
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
