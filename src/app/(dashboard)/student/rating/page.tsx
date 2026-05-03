'use client';

import { useMemo } from 'react';
import { RatingTable, type RatingTableRow } from '@/components/shared/RatingTable/RatingTable';
import { useOverallRating } from '@/lib/hooks/useRating';
import { PageHero } from '@/components/ui';
import styles from './rating.module.scss';

const AVATAR_COLORS = [
  'linear-gradient(135deg, #193f5c 0%, #2c8cad 100%)',
  'linear-gradient(135deg, #45b5c1 0%, #2e7f8b 100%)',
  'linear-gradient(135deg, #506786 0%, #1d3247 100%)',
  'linear-gradient(135deg, #76b2c2 0%, #3d798b 100%)',
];

const DEFAULT_FILTER_LABEL = 'Все предметы';

function getAvatarLabel(firstName: string, lastName: string) {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

function getStudentName(firstName: string, lastName: string, fatherName?: string | null) {
  return [lastName, firstName, fatherName].filter(Boolean).join(' ');
}

export default function StudentRatingPage() {
  const { data: rating, isLoading, error } = useOverallRating();

  const rows = useMemo<RatingTableRow[]>(() => {
    return (rating?.topStudents ?? [])
      .slice()
      .sort((left, right) => left.ratingPosition - right.ratingPosition)
      .map((student, index) => ({
        position: student.ratingPosition,
        studentName: getStudentName(student.firstName, student.lastName, student.fatherName),
        score: student.totalGrade,
        avatarLabel: getAvatarLabel(student.firstName, student.lastName),
        avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
      }));
  }, [rating?.topStudents]);

  const groupName = rating?.groupName ?? '...';
  const currentStudentScore = rating?.totalGrade ?? 0;
  const activeStudentsCount = rows.length;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero
          className={styles.ratingHero}
          title={`Рейтинг группы ${groupName}`}
          subtitle="Академическая успеваемость за текущий семестр"
        />

        <section className={styles.overview}>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>Средний балл</span>
            <span className={styles.statValue}>
              {isLoading ? '...' : currentStudentScore.toFixed(1)}
            </span>
          </article>

          <article className={styles.statCard}>
            <span className={styles.statLabel}>Студентов</span>
            <span className={styles.statValue}>{isLoading ? '...' : activeStudentsCount}</span>
            <span className={styles.statHint}>Активный поток</span>
          </article>

          <article className={styles.filterCard}>
            <span className={styles.filterTitle}>Фильтр по предметам</span>

            <div className={styles.filterList}>
              <button
                type="button"
                className={`${styles.filterButton} ${styles.filterButtonActive}`}
              >
                {DEFAULT_FILTER_LABEL}
              </button>
            </div>
          </article>
        </section>

        {isLoading ? (
          <RatingTable rows={[]} visibleCount={0} totalCount={0} />
        ) : error ? (
          <section className={styles.statCard}>
            <span className={styles.statLabel}>Ошибка</span>
            <span className={styles.statValue}>Не удалось загрузить рейтинг</span>
          </section>
        ) : (
          <RatingTable
            rows={rows}
            visibleCount={rows.length}
            totalCount={activeStudentsCount}
          />
        )}
      </div>
    </div>
  );
}
