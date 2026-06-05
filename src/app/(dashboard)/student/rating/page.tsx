'use client';

import BedtimeRoundedIcon from '@mui/icons-material/BedtimeRounded';
import { RatingTable } from '@/components/shared/RatingTable/RatingTable';
import { PageHero } from '@/components/ui';
import { useStudentRating } from '@/lib/hooks/useStudentRating';
import styles from './rating.module.scss';

const DEFAULT_FILTER_LABEL = 'Все предметы';

export default function StudentRatingPage() {
  const {
    subjects,
    isSubjectsLoading,
    activeSubjectId,
    selectSubject,
    isLoading,
    error,
    groupName,
    heroSubtitle,
    loaderTitle,
    loaderHint,
    averageGroupScore,
    activeStudentsCount,
    visibleRows,
    hasHiddenRows,
    isExpanded,
    expand,
  } = useStudentRating();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero
          className={styles.ratingHero}
          title={`Рейтинг группы ${groupName}`}
          subtitle={heroSubtitle}
        />

        <section className={styles.updateNotice} aria-label="Информация об обновлении рейтинга">
          <div className={styles.updateNoticeIcon} aria-hidden="true">
            <BedtimeRoundedIcon sx={{ fontSize: 20 }} />
          </div>

          <div className={styles.updateNoticeCopy}>
            <span className={styles.updateNoticeTitle}>Рейтинг обновляется автоматически каждую ночь в 02:00</span>
          </div>
        </section>

        <section className={styles.overview}>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>Средний балл</span>
            <span className={styles.statValue}>{isLoading ? '...' : averageGroupScore.toFixed(1)}</span>
          </article>

          <article className={styles.statCard}>
            <span className={styles.statLabel}>Студентов</span>
            <span className={styles.statValue}>{isLoading ? '...' : activeStudentsCount}</span>
          </article>

          <article className={styles.filterCard}>
            <span className={styles.filterTitle}>Фильтр по предметам</span>

            <div className={styles.filterList}>
              <button
                type="button"
                className={`${styles.filterButton} ${activeSubjectId === null ? styles.filterButtonActive : ''}`}
                onClick={() => selectSubject(null)}
                aria-pressed={activeSubjectId === null}
              >
                <span className={styles.filterButtonLabel}>{DEFAULT_FILTER_LABEL}</span>
              </button>

              {isSubjectsLoading ? null : (
                subjects.map((subject) => (
                  <button
                    key={subject.subjectId}
                    type="button"
                    className={`${styles.filterButton} ${activeSubjectId === subject.subjectId ? styles.filterButtonActive : ''}`}
                    onClick={() => selectSubject(subject.subjectId)}
                    aria-pressed={activeSubjectId === subject.subjectId}
                  >
                    <span className={styles.filterButtonLabel}>{subject.subjectName}</span>
                  </button>
                ))
              )}
            </div>
          </article>
        </section>

        {isLoading ? (
          <section className={styles.loaderCard} aria-live="polite" aria-busy="true">
            <div className={styles.loaderPulse} aria-hidden="true">
              <span className={styles.loaderDot} />
              <span className={styles.loaderDot} />
              <span className={styles.loaderDot} />
            </div>

            <div className={styles.loaderCopy}>
              <span className={styles.loaderTitle}>{loaderTitle}</span>
              <span className={styles.loaderHint}>{loaderHint}</span>
            </div>
          </section>
        ) : error ? (
          <section className={styles.statCard}>
            <span className={styles.statLabel}>Ошибка</span>
            <span className={styles.statValue}>—</span>
            <span className={styles.statHint}>Не удалось загрузить рейтинг</span>
          </section>
        ) : visibleRows.length === 0 ? (
          <section className={styles.statCard}>
            <span className={styles.statLabel}>Нет данных</span>
            <span className={styles.statValue}>—</span>
            <span className={styles.statHint}>Рейтинг по выбранному предмету пока пуст</span>
          </section>
        ) : (
          <RatingTable
            rows={visibleRows}
            visibleCount={visibleRows.length}
            totalCount={activeStudentsCount}
            onShowMore={hasHiddenRows && !isExpanded ? expand : undefined}
            showAllLabel="Показать больше"
          />
        )}
      </div>
    </div>
  );
}
