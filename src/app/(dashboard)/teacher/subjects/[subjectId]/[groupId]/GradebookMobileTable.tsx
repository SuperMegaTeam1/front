import { formatShortFullName } from '@/lib/utils/fullName';
import { isGradeDirty } from './gradebook.helpers';
import { GradeInput } from './GradeInput';
import type { LessonColumn, StudentGradeRow } from './gradebook.types';
import styles from './gradebook.module.scss';

interface GradebookMobileTableProps {
  groupId: string;
  rows: StudentGradeRow[];
  visibleColumns: LessonColumn[];
  visibleDateStart: number;
  mobilePageIndex: number;
  mobilePageCount: number;
  onPreviousDates: () => void;
  onNextDates: () => void;
  onGradeChange: (studentId: string, lessonId: string, value: string) => void;
}

/** Мобильная таблица журнала: даты постранично с пагинацией. */
export function GradebookMobileTable({
  groupId,
  rows,
  visibleColumns,
  visibleDateStart,
  mobilePageIndex,
  mobilePageCount,
  onPreviousDates,
  onNextDates,
  onGradeChange,
}: GradebookMobileTableProps) {
  return (
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

              return (
                <div key={`${student.studentId}-${column.lessonId}`} className={styles.mobileMarkSlot}>
                  <GradeInput
                    value={grade.value}
                    isDirty={isGradeDirty(grade.value, grade.initialValue)}
                    ariaLabel={`Оценка студента ${student.name} за ${column.label}`}
                    onChange={(value) => onGradeChange(student.studentId, column.lessonId, value)}
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
          onClick={onPreviousDates}
          disabled={mobilePageIndex === 0}
          aria-label="Предыдущие даты"
        >
          ‹
        </button>
        <span className={styles.paginationPage}>{mobilePageIndex + 1}</span>
        <button
          type="button"
          className={styles.paginationButton}
          onClick={onNextDates}
          disabled={mobilePageIndex === mobilePageCount - 1}
          aria-label="Следующие даты"
        >
          ›
        </button>
      </div>
    </section>
  );
}
