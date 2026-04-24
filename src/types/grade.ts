/** Одна оценка за конкретную пару */
export interface GradeEntry {
  lessonId: number;
  lessonDate: string;
  points: number | null;
}

/** Оценки студента по предмету */
export interface Grade {
  subjectId: number;
  subjectName: string;
  entries: GradeEntry[];
  totalPoints: number;
}

/** Строка журнала группы (для преподавателя) */
export interface GradebookRow {
  studentId: number;
  studentName: string;
  entries: GradeEntry[];
  totalPoints: number;
}

/** Данные для выставления баллов преподавателем */
export interface SetGradePayload {
  lessonId: number;
  studentId: number;
  points: number;
}
