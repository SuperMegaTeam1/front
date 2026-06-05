'use client';

import { useMemo, useState } from 'react';
import { useOverallRating, useSubjectRating } from '@/lib/hooks/useRating';
import { useMyStudentSubjects } from '@/lib/hooks/useSubjects';
import { buildRatingRows, getAverageScore } from '@/lib/utils/ratingView';

const DEFAULT_SUBTITLE = 'Академическая успеваемость за текущий семестр';
const INITIAL_VISIBLE_ROWS = 5;

export function useStudentRating() {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: subjects = [], isLoading: isSubjectsLoading } = useMyStudentSubjects();
  const {
    data: overallRating,
    isLoading: isOverallLoading,
    error: overallError,
  } = useOverallRating();

  const activeSubjectId = useMemo(() => {
    if (!selectedSubjectId) {
      return null;
    }

    const isAvailable = subjects.some((subject) => subject.subjectId === selectedSubjectId);
    return isAvailable ? selectedSubjectId : null;
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

  const rows = useMemo(() => buildRatingRows(activeRating?.topStudents), [activeRating?.topStudents]);
  const averageGroupScore = useMemo(() => getAverageScore(activeRating?.topStudents), [activeRating?.topStudents]);

  const groupName = activeRating?.groupName ?? overallRating?.groupName ?? '...';
  const activeStudentsCount = rows.length;
  const hasHiddenRows = rows.length > INITIAL_VISIBLE_ROWS;
  const visibleRows = isExpanded ? rows : rows.slice(0, INITIAL_VISIBLE_ROWS);

  const heroSubtitle = selectedSubjectName
    ? `Рейтинг по предмету «${selectedSubjectName}»`
    : DEFAULT_SUBTITLE;
  const loaderTitle = activeSubjectId ? 'Загружаем рейтинг по предмету' : 'Загружаем рейтинг группы';
  const loaderHint = selectedSubjectName
    ? `Обновляем список лидеров по предмету «${selectedSubjectName}».`
    : 'Собираем актуальные позиции и средний балл группы.';

  const selectSubject = (subjectId: string | null) => {
    setIsExpanded(false);
    setSelectedSubjectId(subjectId);
  };

  return {
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
    expand: () => setIsExpanded(true),
  };
}
