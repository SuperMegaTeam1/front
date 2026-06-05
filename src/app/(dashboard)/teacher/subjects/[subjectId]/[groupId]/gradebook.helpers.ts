import { getComparableJournalValue, normalizeJournalValue } from '@/lib/utils/journal';
import type { GradeValue } from './gradebook.types';
import styles from './gradebook.module.scss';

/** CSS-класс для инпута оценки: подсветка «Н» и «грязного» (изменённого) значения. */
export function getGradeInputClassName(value: GradeValue, isDirty: boolean) {
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

/** Изменилось ли значение относительно исходного (с учётом нормализации). */
export function isGradeDirty(value: GradeValue, initialValue: GradeValue) {
  return getComparableJournalValue(value) !== getComparableJournalValue(initialValue);
}
