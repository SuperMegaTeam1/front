import type { RatingTableRow } from '@/components/shared/RatingTable/RatingTable';
import { joinFullName } from './fullName';

/** Градиенты аватарок в таблице рейтинга. */
export const RATING_AVATAR_COLORS = [
  'linear-gradient(135deg, #193f5c 0%, #2c8cad 100%)',
  'linear-gradient(135deg, #45b5c1 0%, #2e7f8b 100%)',
  'linear-gradient(135deg, #506786 0%, #1d3247 100%)',
  'linear-gradient(135deg, #76b2c2 0%, #3d798b 100%)',
];

export interface RatingStudent {
  ratingPosition: number;
  firstName: string;
  lastName: string;
  fatherName?: string | null;
  totalGrade: number;
}

export function getRatingAvatarLabel(firstName: string, lastName: string) {
  return `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();
}

/** Преобразует список лидеров в строки таблицы рейтинга (с сортировкой по позиции). */
export function buildRatingRows(students: RatingStudent[] | undefined): RatingTableRow[] {
  return (students ?? [])
    .slice()
    .sort((left, right) => left.ratingPosition - right.ratingPosition)
    .map((student, index) => ({
      position: student.ratingPosition,
      studentName: joinFullName(student.lastName, student.firstName, student.fatherName),
      score: student.totalGrade,
      avatarLabel: getRatingAvatarLabel(student.firstName, student.lastName),
      avatarColor: RATING_AVATAR_COLORS[index % RATING_AVATAR_COLORS.length],
    }));
}

/** Средний балл группы по списку лидеров. */
export function getAverageScore(students: RatingStudent[] | undefined) {
  if (!students?.length) {
    return 0;
  }

  return students.reduce((sum, student) => sum + student.totalGrade, 0) / students.length;
}
