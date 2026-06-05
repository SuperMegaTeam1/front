import { formatShortFullName } from '@/lib/utils/fullName';
import { isGradeDirty } from './gradebook.helpers';
import { GradeInput } from './GradeInput';
import type { CSSProperties } from 'react';
import type { LessonColumn, StudentGradeRow } from './gradebook.types';
import styles from './gradebook.module.scss';

interface GradebookTableProps {
  groupId: string;
  lessonColumns: LessonColumn[];
  rows: StudentGradeRow[];
  gridStyle: CSSProperties;
  onGradeChange: (studentId: string, lessonId: string, value: string) => void;
}

/** Десктопная таблица журнала: все даты в один ряд. */
export function GradebookTable({ groupId, lessonColumns, rows, gridStyle, onGradeChange }: GradebookTableProps) {
  return (
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

              {student.grades.map((grade, index) => (
                <div key={`${student.studentId}-${grade.lessonId}`} className={styles.markSlot}>
                  <GradeInput
                    value={grade.value}
                    isDirty={isGradeDirty(grade.value, grade.initialValue)}
                    ariaLabel={`Оценка студента ${student.name} за ${lessonColumns[index]?.label ?? 'занятие'}`}
                    onChange={(value) => onGradeChange(student.studentId, grade.lessonId, value)}
                  />
                </div>
              ))}

              <div className={styles.totalCell}>{student.total}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
