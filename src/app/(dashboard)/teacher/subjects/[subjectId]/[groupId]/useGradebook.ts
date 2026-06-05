'use client';

import { useMemo, useState } from 'react';
import type { SaveLessonJournalPayload } from '@/lib/api/types';
import { useGroupStudents, useSaveLessonJournal, useTeacherGroupJournal } from '@/lib/hooks/useTeacherJournal';
import { useStatusMessage } from '@/lib/hooks/useStatusMessage';
import { formatDateCompact } from '@/lib/utils/formatDate';
import { formatShortFullName, getInitials, joinFullName } from '@/lib/utils/fullName';
import {
  buildJournalValueMap,
  getCellKey,
  getComparableJournalValue,
  getTotalPoints,
  parseJournalInput,
  sanitizeJournalValue,
} from '@/lib/utils/journal';
import {
  AVATAR_TONES,
  type DraftGradeMap,
  type LessonColumn,
  type StudentGradeRow,
} from './gradebook.types';

const DATES_PER_MOBILE_PAGE = 2;

export function useGradebook(subjectId: string, groupId: string) {
  const saveMutation = useSaveLessonJournal();
  const { message: submitMessage, setMessage: setSubmitMessage } = useStatusMessage();
  const [mobilePageIndex, setMobilePageIndex] = useState(0);
  const [draftGrades, setDraftGrades] = useState<DraftGradeMap>({});

  const {
    data: journal,
    isLoading: isJournalLoading,
    error: journalError,
  } = useTeacherGroupJournal(subjectId, groupId);
  const {
    data: students = [],
    isLoading: isStudentsLoading,
    error: studentsError,
  } = useGroupStudents(groupId, Boolean(groupId));

  const lessonColumns = useMemo<LessonColumn[]>(() => {
    const seen = new Set<string>();
    const columns: LessonColumn[] = [];

    for (const item of journal?.items ?? []) {
      if (seen.has(item.lessonId)) {
        continue;
      }

      seen.add(item.lessonId);
      columns.push({
        lessonId: item.lessonId,
        date: item.date,
        label: formatDateCompact(item.date),
      });
    }

    return columns.sort((a, b) => a.date.localeCompare(b.date));
  }, [journal?.items]);

  const initialGrades = useMemo(() => buildJournalValueMap(journal?.items ?? []), [journal?.items]);

  const rows = useMemo<StudentGradeRow[]>(() => {
    const studentMap = new Map(
      students.map((student) => [
        student.studentId,
        joinFullName(student.lastName, student.firstName, student.fatherName),
      ])
    );
    const journalStudentIds = Array.from(new Set((journal?.items ?? []).map((item) => item.studentId)));
    const allStudentIds = Array.from(new Set([...students.map((student) => student.studentId), ...journalStudentIds]));

    return allStudentIds.map((studentId, index) => {
      const fullName = studentMap.get(studentId) ?? `Студент ${studentId.slice(0, 8)}`;
      const grades = lessonColumns.map((column) => {
        const key = getCellKey(studentId, column.lessonId);
        const initialValue = initialGrades.get(key) ?? '';

        return {
          lessonId: column.lessonId,
          initialValue,
          value: draftGrades[key] ?? initialValue,
        };
      });

      return {
        studentId,
        initials: getInitials(fullName),
        name: fullName,
        avatarTone: AVATAR_TONES[index % AVATAR_TONES.length],
        grades,
        total: getTotalPoints(grades.map((grade) => grade.value)),
      };
    });
  }, [draftGrades, initialGrades, journal?.items, lessonColumns, students]);

  const mobilePageCount = Math.max(1, Math.ceil(lessonColumns.length / DATES_PER_MOBILE_PAGE));
  const visibleDateStart = mobilePageIndex * DATES_PER_MOBILE_PAGE;
  const visibleColumns = lessonColumns.slice(visibleDateStart, visibleDateStart + DATES_PER_MOBILE_PAGE);
  const gridStyle = {
    gridTemplateColumns: `minmax(360px, 1.9fr) repeat(${Math.max(lessonColumns.length, 1)}, minmax(92px, 1fr)) 132px`,
  };

  const goToPreviousDates = () => setMobilePageIndex((current) => Math.max(0, current - 1));
  const goToNextDates = () => setMobilePageIndex((current) => Math.min(mobilePageCount - 1, current + 1));

  const isLoading = isJournalLoading || isStudentsLoading;
  const hasError = Boolean(journalError || studentsError);
  const hasRows = rows.length > 0 && lessonColumns.length > 0;

  const handleGradeChange = (studentId: string, lessonId: string, value: string) => {
    const key = getCellKey(studentId, lessonId);
    setDraftGrades((current) => ({ ...current, [key]: sanitizeJournalValue(value) }));
  };

  const handleSubmit = async () => {
    const invalidInputs: string[] = [];
    const updatesByLessonId = new Map<string, SaveLessonJournalPayload['items']>();

    for (const student of rows) {
      for (const grade of student.grades) {
        if (getComparableJournalValue(grade.value) === getComparableJournalValue(grade.initialValue)) {
          continue;
        }

        const parsed = parseJournalInput(grade.value);

        if (parsed === 'invalid') {
          invalidInputs.push(formatShortFullName(student.name));
          continue;
        }

        const lessonItems = updatesByLessonId.get(grade.lessonId) ?? [];

        if ('grade' in parsed) {
          lessonItems.push({ studentId: student.studentId, grade: parsed.grade });
        } else {
          lessonItems.push({ studentId: student.studentId, attended: parsed.attended, grade: null });
        }

        updatesByLessonId.set(grade.lessonId, lessonItems);
      }
    }

    if (invalidInputs.length > 0) {
      setSubmitMessage({
        type: 'error',
        text: `Проверьте значения у студентов: ${invalidInputs.slice(0, 3).join(', ')}${invalidInputs.length > 3 ? '…' : ''}`,
      });
      return;
    }

    if (updatesByLessonId.size === 0) {
      setSubmitMessage({ type: 'info', text: 'Нет изменений для отправки.' });
      return;
    }

    try {
      for (const [lessonId, items] of updatesByLessonId) {
        await saveMutation.mutateAsync({ lessonId, payload: { items } });
      }

      setDraftGrades({});
      setSubmitMessage({ type: 'success', text: 'Изменения в журнале сохранены.' });
    } catch {
      setSubmitMessage({ type: 'error', text: 'Не удалось сохранить изменения в журнале.' });
    }
  };

  return {
    lessonColumns,
    rows,
    gridStyle,
    isLoading,
    hasError,
    hasRows,
    isSaving: saveMutation.isPending,
    submitMessage,
    handleGradeChange,
    handleSubmit,
    // мобильная пагинация по датам
    visibleColumns,
    visibleDateStart,
    mobilePageIndex,
    mobilePageCount,
    goToPreviousDates,
    goToNextDates,
  };
}
