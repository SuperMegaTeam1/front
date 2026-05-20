'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { PageHero } from '@/components/ui';
import type { SaveLessonJournalPayload } from '@/lib/api/types';
import { useGroupStudents, useSaveLessonJournal, useTeacherGroupJournal } from '@/lib/hooks/useTeacherJournal';
import { formatDateCompact } from '@/lib/utils/formatDate';
import {
  formatJournalDisplayValue,
  getCellKey,
  getComparableJournalValue,
  getTotalPoints,
  normalizeJournalValue,
  parseJournalInput,
  sanitizeJournalValue,
} from '@/lib/utils/journal';
import styles from './gradebook.module.scss';

type GradeValue = string;
type DraftGradeMap = Record<string, string>;
type AvatarTone = 'violet' | 'blue' | 'sky' | 'lilac' | 'gray';

interface LessonColumn {
  lessonId: string;
  date: string;
  label: string;
}

interface StudentGradeCell {
  lessonId: string;
  initialValue: GradeValue;
  value: GradeValue;
}

interface StudentGradeRow {
  studentId: string;
  initials: string;
  name: string;
  avatarTone: AvatarTone;
  grades: StudentGradeCell[];
  total: number;
}

const DATES_PER_MOBILE_PAGE = 2;
const AVATAR_TONES: AvatarTone[] = ['violet', 'blue', 'sky', 'lilac', 'gray'];

function formatShortFullName(fullName: string) {
  const [lastName, firstName, fatherName] = fullName.trim().split(/\s+/);

  if (!lastName || !firstName) {
    return fullName;
  }

  return `${lastName} ${firstName[0]}.${fatherName ? ` ${fatherName[0]}.` : ''}`.trim();
}

function getInitials(fullName: string) {
  const [lastName, firstName] = fullName.trim().split(/\s+/);
  return `${lastName?.[0] ?? ''}${firstName?.[0] ?? ''}`.toUpperCase();
}

function getGradeInputClassName(value: GradeValue, isDirty: boolean) {
  const classNames = [styles.gradeInput];
  const normalized = normalizeJournalValue(value);

  if (normalized === 'Н') {
    classNames.push(styles.gradeInputAbsent);
  }

  if (isDirty) {
    classNames.push(styles.gradeInputDirty);
  }

  return classNames.join(' ');
}

export default function TeacherGroupGradebookPage() {
  const params = useParams<{ subjectId: string; groupId: string }>();
  const searchParams = useSearchParams();
  const subjectId = params.subjectId ?? '';
  const groupId = params.groupId ?? '';
  const groupName = searchParams.get('groupName') ?? groupId;
  const subjectTitle = searchParams.get('subjectName') ?? 'Предмет';
  const saveMutation = useSaveLessonJournal();
  const [mobilePageIndex, setMobilePageIndex] = useState(0);
  const [draftGrades, setDraftGrades] = useState<DraftGradeMap>({});
  const [submitMessage, setSubmitMessage] = useState<{ type: 'idle' | 'info' | 'success' | 'error'; text: string }>({
    type: 'idle',
    text: '',
  });

  useEffect(() => {
    if (submitMessage.type !== 'success') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSubmitMessage({ type: 'idle', text: '' });
    }, 2500);

    return () => window.clearTimeout(timeoutId);
  }, [submitMessage]);

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

  const initialGrades = useMemo(() => {
    const valueMap = new Map<string, string>();

    for (const item of journal?.items ?? []) {
      const key = getCellKey(item.studentId, item.lessonId);
      const nextValue = formatJournalDisplayValue(item.attended, item.grade);

      if (!valueMap.has(key) || typeof item.grade === 'number') {
        valueMap.set(key, nextValue);
      }
    }

    return valueMap;
  }, [journal?.items]);

  const rows = useMemo<StudentGradeRow[]>(() => {
    const studentMap = new Map(
      students.map((student) => [
        student.studentId,
        `${student.lastName} ${student.firstName}${student.fatherName ? ` ${student.fatherName}` : ''}`.trim(),
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

  const goToPreviousDates = () => {
    setMobilePageIndex((current) => Math.max(0, current - 1));
  };

  const goToNextDates = () => {
    setMobilePageIndex((current) => Math.min(mobilePageCount - 1, current + 1));
  };

  const isLoading = isJournalLoading || isStudentsLoading;
  const hasError = journalError || studentsError;
  const hasRows = rows.length > 0 && lessonColumns.length > 0;

  const handleGradeChange = (studentId: string, lessonId: string, value: string) => {
    const key = getCellKey(studentId, lessonId);

    setDraftGrades((current) => ({
      ...current,
      [key]: sanitizeJournalValue(value),
    }));
  };

  const handleSubmit = async () => {
    const invalidInputs: string[] = [];
    const updatesByLessonId = new Map<string, SaveLessonJournalPayload['items']>();

    for (const student of rows) {
      for (const grade of student.grades) {
        const currentComparable = getComparableJournalValue(grade.value);
        const initialComparable = getComparableJournalValue(grade.initialValue);

        if (currentComparable === initialComparable) {
          continue;
        }

        const parsed = parseJournalInput(grade.value);

        if (parsed === 'invalid') {
          invalidInputs.push(formatShortFullName(student.name));
          continue;
        }

        const lessonItems = updatesByLessonId.get(grade.lessonId) ?? [];

        if ('grade' in parsed) {
          lessonItems.push({
            studentId: student.studentId,
            grade: parsed.grade,
          });
        } else {
          lessonItems.push({
            studentId: student.studentId,
            attended: parsed.attended,
            grade: null,
          });
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
      setSubmitMessage({
        type: 'info',
        text: 'Нет изменений для отправки.',
      });
      return;
    }

    try {
      for (const [lessonId, items] of updatesByLessonId) {
        await saveMutation.mutateAsync({
          lessonId,
          payload: { items },
        });
      }

      setDraftGrades({});
      setSubmitMessage({
        type: 'success',
        text: 'Изменения в журнале сохранены.',
      });
    } catch {
      setSubmitMessage({
        type: 'error',
        text: 'Не удалось сохранить изменения в журнале.',
      });
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <PageHero
          className={styles.gradebookHero}
          title={`Журнал группы ${groupName}`}
          subtitle={subjectTitle}
        />

        {isLoading ? (
          <section className={styles.stateCard}>Загружаем журнал группы и список студентов…</section>
        ) : hasError ? (
          <section className={styles.stateCard}>Не удалось загрузить журнал группы.</section>
        ) : !hasRows ? (
          <section className={styles.stateCard}>По этому предмету пока нет записей в журнале.</section>
        ) : (
          <>
            <section
              className={`${styles.gradebookCard} ${styles.desktopGradebook}`}
              aria-label={`Журнал оценок группы ${groupId}`}
            >
              <div className={styles.tableScroller}>
                <div className={styles.tableHeader} style={gridStyle}>
                  <div className={styles.studentHeader}>ФИО студента</div>
                  {lessonColumns.map((column) => (
                    <div key={column.lessonId} className={styles.dateHeader}>{column.label}</div>
                  ))}
                  <div className={styles.totalHeader}>Все<br />баллы</div>
                </div>

                <div className={styles.tableBody}>
                  {rows.map((student) => (
                    <div key={student.studentId} className={styles.tableRow} style={gridStyle}>
                      <div className={styles.studentCell}>
                        <span className={`${styles.avatar} ${styles[student.avatarTone]}`}>{student.initials}</span>
                        <span className={styles.studentName}>{formatShortFullName(student.name)}</span>
                      </div>

                      {student.grades.map((grade, index) => {
                        const isDirty = getComparableJournalValue(grade.value) !== getComparableJournalValue(grade.initialValue);

                        return (
                          <div key={`${student.studentId}-${grade.lessonId}`} className={styles.markSlot}>
                            <input
                              type="text"
                              inputMode="text"
                              maxLength={3}
                              value={grade.value}
                              className={getGradeInputClassName(grade.value, isDirty)}
                              onChange={(event) => handleGradeChange(student.studentId, grade.lessonId, event.target.value)}
                              aria-label={`Оценка студента ${student.name} за ${lessonColumns[index]?.label ?? 'занятие'}`}
                            />
                          </div>
                        );
                      })}

                      <div className={styles.totalCell}>{student.total}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section
              className={`${styles.gradebookCard} ${styles.mobileGradebook}`}
              aria-label={`Мобильный журнал оценок группы ${groupId}`}
            >
              <div className={styles.mobileTableHeader}>
                <div className={styles.mobileStudentHeader}>ФИО студента</div>
                {visibleColumns.map((column) => (
                  <div key={column.lessonId} className={styles.mobileDateHeader}>{column.label}</div>
                ))}
              </div>

              <div className={styles.mobileTableBody}>
                {rows.map((student) => (
                  <div key={student.studentId} className={styles.mobileTableRow}>
                    <div className={styles.mobileStudentCell}>
                      <span className={`${styles.avatar} ${styles[student.avatarTone]}`}>{student.initials}</span>
                      <span className={styles.mobileStudentName}>{formatShortFullName(student.name)}</span>
                    </div>

                    {visibleColumns.map((column, index) => {
                      const grade = student.grades[visibleDateStart + index];

                      if (!grade) {
                        return <div key={`${student.studentId}-${column.lessonId}`} className={styles.mobileMarkSlot} />;
                      }

                      const isDirty = getComparableJournalValue(grade.value) !== getComparableJournalValue(grade.initialValue);

                      return (
                        <div key={`${student.studentId}-${column.lessonId}`} className={styles.mobileMarkSlot}>
                          <input
                            type="text"
                            inputMode="text"
                            maxLength={3}
                            value={grade.value}
                            className={getGradeInputClassName(grade.value, isDirty)}
                            onChange={(event) => handleGradeChange(student.studentId, column.lessonId, event.target.value)}
                            aria-label={`Оценка студента ${student.name} за ${column.label}`}
                          />
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className={styles.mobilePagination} aria-label="Переключение дат журнала">
                <button
                  type="button"
                  className={styles.paginationButton}
                  onClick={goToPreviousDates}
                  disabled={mobilePageIndex === 0}
                  aria-label="Предыдущие даты"
                >
                  ‹
                </button>
                <span className={styles.paginationPage}>{mobilePageIndex + 1}</span>
                <button
                  type="button"
                  className={styles.paginationButton}
                  onClick={goToNextDates}
                  disabled={mobilePageIndex === mobilePageCount - 1}
                  aria-label="Следующие даты"
                >
                  ›
                </button>
              </div>
            </section>

            <div className={styles.actions}>
              {submitMessage.type !== 'idle' ? (
                <p
                  className={`${styles.statusText} ${
                    submitMessage.type === 'success'
                      ? styles.statusSuccess
                      : submitMessage.type === 'error'
                        ? styles.statusError
                        : ''
                  }`}
                >
                  {submitMessage.text}
                </p>
              ) : null}

              <button
                type="button"
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={saveMutation.isPending}
              >
                <SendRoundedIcon sx={{ fontSize: 18 }} />
                {saveMutation.isPending ? 'Сохраняем…' : 'Отправить баллы'}
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
