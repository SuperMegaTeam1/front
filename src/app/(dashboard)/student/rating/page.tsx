'use client';

import { useMemo, useState } from 'react';
import { RatingTable, type RatingTableRow } from '@/components/shared/RatingTable/RatingTable';
import { PageHero } from '@/components/ui';
import { useOverallRating, useSubjectRating } from '@/lib/hooks/useRating';
import { useMyStudentSubjects } from '@/lib/hooks/useSubjects';
import styles from './rating.module.scss';

const AVATAR_COLORS = [
  'linear-gradient(135deg, #193f5c 0%, #2c8cad 100%)',
  'linear-gradient(135deg, #45b5c1 0%, #2e7f8b 100%)',
  'linear-gradient(135deg, #506786 0%, #1d3247 100%)',
  'linear-gradient(135deg, #76b2c2 0%, #3d798b 100%)',
];

const DEFAULT_FILTER_LABEL = 'Все предметы';
const DEFAULT_SUBTITLE = 'Академическая успеваемость за текущий семестр';

function getAvatarLabel(firstName: string, lastName: string) {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

function getStudentName(firstName: string, lastName: string, fatherName?: string | null) {
  return [lastName, firstName, fatherName].filter(Boolean).join(' ');
}

export default function StudentRatingPage() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  const {
    data: subjects = [],
    isLoading: isSubjectsLoading,
  } = useMyStudentSubjects();
  const {
    data: overallRating,
    isLoading: isOverallLoading,
    error: overallError,
  } = useOverallRating();

  const activeSubjectId = useMemo(() => {
    if (!selectedSubjectId) {
      return null;
    }

    const isSelectedSubjectAvailable = subjects.some(
      (subject) => subject.subjectId === selectedSubjectId,
    );

    return isSelectedSubjectAvailable ? selectedSubjectId : null;
  }, [selectedSubjectId, subjects]);

  const {
    data: subjectRating,
    isLoading: isSubjectLoading,
    error: subjectError,
  } = useSubjectRating(activeSubjectId ?? '');

  const activeRating = activeSubjectId ? subjectRating : overallRating;
  const isLoading = activeSubjectId ? isSubjectLoading : isOverallLoading;
  const error = activeSubjectId ? subjectError : overallError;

  const selectedSubjectName = useMemo(() => {
    if (!activeSubjectId) {
      return null;
    }

    return (
      subjects.find((subject) => subject.subjectId === activeSubjectId)?.subjectName
      ?? subjectRating?.subjectName
      ?? null
    );
  }, [activeSubjectId, subjectRating?.subjectName, subjects]);

  const rows = useMemo<RatingTableRow[]>(() => {
    return (activeRating?.topStudents ?? [])
      .slice()
      .sort((left, right) => left.ratingPosition - right.ratingPosition)
      .map((student, index) => ({
        position: student.ratingPosition,
        studentName: getStudentName(student.firstName, student.lastName, student.fatherName),
        score: student.totalGrade,
        avatarLabel: getAvatarLabel(student.firstName, student.lastName),
        avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
      }));
  }, [activeRating?.topStudents]);

  const groupName = activeRating?.groupName ?? overallRating?.groupName ?? '...';
  const activeStudentsCount = rows.length;

  const averageGroupScore = useMemo(() => {
    if (!activeRating?.topStudents?.length) {
      return 0;
    }

    const totalScore = activeRating.topStudents.reduce((sum, student) => sum + student.totalGrade, 0);
    return totalScore / activeRating.topStudents.length;
  }, [activeRating?.topStudents]);

  const heroSubtitle = selectedSubjectName
    ? `Рейтинг по предмету «${selectedSubjectName}»`
    : DEFAULT_SUBTITLE;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero
          className={styles.ratingHero}
          title={`Рейтинг группы ${groupName}`}
          subtitle={heroSubtitle}
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
                className={`${styles.filterButton} ${activeSubjectId === null ? styles.filterButtonActive : ''}`}
                onClick={() => setSelectedSubjectId(null)}
              >
                {DEFAULT_FILTER_LABEL}
              </button>

              {isSubjectsLoading ? null : (
                subjects.map((subject) => (
                  <button
                    key={subject.subjectId}
                    type="button"
                    className={`${styles.filterButton} ${activeSubjectId === subject.subjectId ? styles.filterButtonActive : ''}`}
                    onClick={() => setSelectedSubjectId(subject.subjectId)}
                  >
                    {subject.subjectName}
                  </button>
                ))
              )}
            </div>
          </article>
        </section>

        {isLoading ? (
          <RatingTable rows={[]} visibleCount={0} totalCount={0} />
        ) : error ? (
          <section className={styles.statCard}>
            <span className={styles.statLabel}>Ошибка</span>
            <span className={styles.statValue}>—</span>
            <span className={styles.statHint}>Не удалось загрузить рейтинг</span>
          </section>
        ) : rows.length === 0 ? (
          <section className={styles.statCard}>
            <span className={styles.statLabel}>Нет данных</span>
            <span className={styles.statValue}>—</span>
            <span className={styles.statHint}>Рейтинг по выбранному предмету пока пуст</span>
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
