export type GradeValue = string;
export type DraftGradeMap = Record<string, string>;
export type AvatarTone = 'violet' | 'blue' | 'sky' | 'lilac' | 'gray';

export interface LessonColumn {
  lessonId: string;
  date: string;
  label: string;
}

export interface StudentGradeCell {
  lessonId: string;
  initialValue: GradeValue;
  value: GradeValue;
}

export interface StudentGradeRow {
  studentId: string;
  initials: string;
  name: string;
  avatarTone: AvatarTone;
  grades: StudentGradeCell[];
  total: number;
}

export const AVATAR_TONES: AvatarTone[] = ['violet', 'blue', 'sky', 'lilac', 'gray'];
