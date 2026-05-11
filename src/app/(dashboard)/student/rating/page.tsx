'use client';

import { useMemo, useState } from 'react';
import { RatingTable, type RatingTableRow } from '@/components/shared/RatingTable/RatingTable';
import { useOverallRating, useSubjectRating } from '@/lib/hooks/useRating';
import { useStudentMeSubjects } from '@/lib/hooks/useSubjects';
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
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const { data: subjects } = useStudentMeSubjects();

  const overall = useOverallRating();
  const bySubject = useSubjectRating(selectedSubjectId ?? '');

  const { data: rating, isLoading, error } = selectedSubjectId ? bySubject : overall;

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
  const activeStudentsCount = rows.length;
  const averageGroupScore = useMemo(() => {
    if (!rating?.topStudents?.length) {
      return 0;
    }

    const totalScore = rating.topStudents.reduce((sum, student) => sum + student.totalGrade, 0);
    return totalScore / rating.topStudents.length;
  }, [rating?.topStudents]);

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
              {isLoading ? '...' : averageGroupScore.toFixed(1)}
            </span>
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
                className={`${styles.filterButton} ${selectedSubjectId === null ? styles.filterButtonActive : ''}`}
                onClick={() => setSelectedSubjectId(null)}
              >
                {DEFAULT_FILTER_LABEL}
              </button>
              {subjects?.map((subject) => (
                <button
                  key={subject.subjectId}
                  type="button"
                  className={`${styles.filterButton} ${selectedSubjectId === subject.subjectId ? styles.filterButtonActive : ''}`}
                  onClick={() => setSelectedSubjectId(subject.subjectId)}
                >
                  {subject.subjectName}
                </button>
              ))}
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
            showAllLabel="Показать больше"
          />
        )}
      </div>
    </div>
  );
}
