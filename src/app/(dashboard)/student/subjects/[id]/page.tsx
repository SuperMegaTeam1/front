'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { PageHero } from '@/components/ui';
import { useSubjectRating } from '@/lib/hooks/useRating';
import { useSubjectDetail } from '@/lib/hooks/useSubjects';
import styles from './subject-detail.module.scss';

type GradeEntry = {
  id: number;
  date: string;
  time: string;
  room: string;
  points: number | null;
};

type SubjectPageData = {
  name: string;
  teacher: string;
  journal: GradeEntry[];
};

const INITIAL_VISIBLE_ROWS = 5;

const FALLBACK_SUBJECT: SubjectPageData = {
  name: 'Предмет',
  teacher: 'преподаватель не указан',
  journal: [],
};

function getTeacherName(
  firstName?: string | null,
  lastName?: string | null,
  fatherName?: string | null
) {
  return [lastName, firstName, fatherName].filter(Boolean).join(' ');
}

export default function StudentSubjectDetailPage() {
  const params = useParams<{ id: string }>();
  const subjectId = params?.id ?? '';
  const { data: subjectDetail } = useSubjectDetail(subjectId);
  const { data: subjectRating } = useSubjectRating(subjectId);
  const [isExpanded, setIsExpanded] = useState(false);

  const subject: SubjectPageData = {
    name: subjectDetail?.name ?? subjectRating?.subjectName ?? FALLBACK_SUBJECT.name,
    teacher:
      getTeacherName(
        subjectDetail?.teacherFirstName,
        subjectDetail?.teacherLastName,
        subjectDetail?.teacherFatherName
      ) || FALLBACK_SUBJECT.teacher,
    journal: FALLBACK_SUBJECT.journal,
  };

  const currentScore = subjectRating?.totalGrade ?? 0;
  const maxScore = 100;
  const groupName = subjectDetail?.groupName ?? subjectRating?.groupName ?? '';
  const ratingPlace = subjectRating?.ratingPosition;
  const totalStudents = subjectRating?.topStudents.length ?? 0;
  const progressWidth = `${Math.min(100, Math.max(0, (currentScore / maxScore) * 100))}%`;
  const hasExtraRows = subject.journal.length > INITIAL_VISIBLE_ROWS;
  const visibleEntries = isExpanded ? subject.journal : subject.journal.slice(0, INITIAL_VISIBLE_ROWS);
  const ratingCaption =
    totalStudents > 0 ? `место среди ${totalStudents} студентов` : 'место в группе пока недоступно';

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero
          title={subject.name}
          subtitle={subject.teacher || undefined}
        />

        <section className={styles.summaryGrid}>
          <article className={styles.progressCard}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>Текущая успеваемость</h2>
            </div>

            <div className={styles.scoreRow}>
              <span className={styles.scoreValue}>{subjectRating ? currentScore : '—'}</span>
              <span className={styles.scoreMax}>/ {maxScore} баллов</span>
            </div>

            <div className={styles.progressTrack} aria-hidden="true">
              <div className={styles.progressFill} style={{ width: progressWidth }} />
            </div>
          </article>

          <article className={styles.ratingCard}>
            <h2 className={styles.ratingTitle}>Рейтинг в группе</h2>
            <p className={styles.ratingSubtitle}>{groupName || 'Группа пока не указана'}</p>

            <div className={styles.ratingValueRow}>
              <span className={styles.ratingValue}>{ratingPlace ?? '—'}</span>
              {ratingPlace ? <span className={styles.ratingSuffix}>-е</span> : null}
            </div>

            <p className={styles.ratingCaption}>{ratingCaption}</p>
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
