'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { PageHero } from '@/components/ui';
import { useSubjectRating } from '@/lib/hooks/useRating';
import { useSubjectDetail } from '@/lib/hooks/useSubjects';
import { buildStudentSubjectDetailViewModel } from '@/lib/utils/subjectView';
import styles from './subject-detail.module.scss';

const INITIAL_VISIBLE_ROWS = 5;
const EMPTY_GROUP_LABEL = 'Группа пока не указана';

export default function StudentSubjectDetailPage() {
  const params = useParams<{ id: string }>();
  const subjectId = params?.id ?? '';
  const { data: subjectDetail } = useSubjectDetail(subjectId);
  const { data: subjectRating } = useSubjectRating(subjectId);
  const [isExpanded, setIsExpanded] = useState(false);

  const viewModel = buildStudentSubjectDetailViewModel({
    subjectDetail,
    subjectRating,
    isExpanded,
    initialVisibleRows: INITIAL_VISIBLE_ROWS,
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero
          title={viewModel.subjectName}
          subtitle={viewModel.teacherSubtitle}
        />

        <section className={styles.summaryGrid}>
          <article className={styles.progressCard}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>Текущая успеваемость</h2>
            </div>

            <div className={styles.scoreRow}>
              <span className={styles.scoreValue}>{viewModel.currentScoreLabel}</span>
              <span className={styles.scoreMax}>/ {viewModel.maxScore} баллов</span>
            </div>

            <div className={styles.progressTrack} aria-hidden="true">
              <div className={styles.progressFill} style={{ width: viewModel.progressWidth }} />
            </div>
          </article>

          <article className={styles.ratingCard}>
            <h2 className={styles.ratingTitle}>Рейтинг в группе</h2>
            <p className={styles.ratingSubtitle}>{viewModel.groupName || EMPTY_GROUP_LABEL}</p>

            <div className={styles.ratingValueRow}>
              <span className={styles.ratingValue}>{viewModel.ratingPlace ?? '—'}</span>
              {viewModel.ratingPlace ? <span className={styles.ratingSuffix}>-е</span> : null}
            </div>

            <p className={styles.ratingCaption}>{viewModel.ratingCaption}</p>
          </article>
        </section>

        <section className={styles.journalSection}>
          <h2 className={styles.journalTitle}>Журнал баллов</h2>

          <div className={styles.tableHeader}>
            <span>Дата</span>
            <span className={styles.pointsHeader}>Баллы</span>
          </div>

          {viewModel.visibleEntries.length === 0 ? (
            <p className={styles.emptyJournal}>Пока нет записей в журнале.</p>
          ) : (
            <div className={styles.rows}>
              {viewModel.visibleEntries.map((entry) => (
                <article key={entry.id} className={styles.row}>
                  <span className={`${styles.rowCell} ${styles.dateCell}`}>{entry.date}</span>
                  <span className={`${styles.rowCell} ${styles.points} ${entry.points === null ? styles.emptyScore : ''}`}>
                    {entry.points === null ? '—' : entry.points}
                  </span>
                </article>
              ))}
            </div>
          )}

          {viewModel.hasExtraRows && (
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
