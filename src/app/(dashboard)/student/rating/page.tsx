'use client';

import BedtimeRoundedIcon from '@mui/icons-material/BedtimeRounded';
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
const INITIAL_VISIBLE_ROWS = 5;

function getAvatarLabel(firstName: string, lastName: string) {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

function getStudentName(firstName: string, lastName: string, fatherName?: string | null) {
  return [lastName, firstName, fatherName].filter(Boolean).join(' ');
}

export default function StudentRatingPage() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

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
  const hasHiddenRows = rows.length > INITIAL_VISIBLE_ROWS;
  const visibleRows = isExpanded ? rows : rows.slice(0, INITIAL_VISIBLE_ROWS);

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
  const loaderTitle = activeSubjectId ? 'Загружаем рейтинг по предмету' : 'Загружаем рейтинг группы';
  const loaderHint = selectedSubjectName
    ? `Обновляем список лидеров по предмету «${selectedSubjectName}».`
    : 'Собираем актуальные позиции и средний балл группы.';

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
                onClick={() => {
                  setIsExpanded(false);
                  setSelectedSubjectId(null);
                }}
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
                    onClick={() => {
                      setIsExpanded(false);
                      setSelectedSubjectId(subject.subjectId);
                    }}
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
        ) : rows.length === 0 ? (
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
            onShowMore={hasHiddenRows && !isExpanded ? () => setIsExpanded(true) : undefined}
            showAllLabel="Показать больше"
          />
        )}
      </div>
    </div>
  );
}
