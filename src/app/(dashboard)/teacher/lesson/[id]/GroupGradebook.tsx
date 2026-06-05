import type { GroupStudentListItem } from '@/lib/api/types';
import { formatShortFullName, joinFullName } from '@/lib/utils/fullName';
import { pluralizeRu } from '@/lib/utils/pluralize';
import styles from './lesson.module.scss';

export interface GroupSectionData {
  groupId: string;
  groupName: string;
  students: GroupStudentListItem[];
}

interface GroupGradebookProps {
  group: GroupSectionData;
  scores: Record<string, string>;
  onScoreChange: (studentId: string, value: string) => void;
}

export function GroupGradebook({ group, scores, onScoreChange }: GroupGradebookProps) {
  const studentsLabel = `${group.students.length} ${pluralizeRu(group.students.length, ['студент', 'студента', 'студентов'])}`;

  return (
    <section className={styles.groupSection}>
      <header className={styles.groupHeader}>
        <h2 className={styles.groupTitle}>Группа {group.groupName}</h2>
        <span className={styles.studentsBadge}>{studentsLabel}</span>
      </header>

      <div className={styles.gradebookCard}>
        <div className={styles.tableHeader}>
          <span className={styles.numCol}>№</span>
          <span className={styles.nameCol}>ФИО студента</span>
          <span className={styles.scoreCol}>Баллы / Н</span>
        </div>

        <div className={styles.tableBody}>
          {group.students.map((student, index) => {
            const fullName = joinFullName(student.lastName, student.firstName, student.fatherName);

            return (
              <div key={student.studentId} className={styles.row}>
                <span className={styles.numCell}>{index + 1}</span>
                <span className={styles.nameCell}>{formatShortFullName(fullName)}</span>
                <input
                  type="text"
                  className={styles.scoreInput}
                  placeholder="—"
                  value={scores[student.studentId] ?? ''}
                  onChange={(event) => onScoreChange(student.studentId, event.target.value)}
                  aria-label={`Значение для ${fullName}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
