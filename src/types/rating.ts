/** Позиция в рейтинге */
export interface RatingEntry {
  position: number;
  studentId: number;
  studentName: string;
  groupName: string;
  totalPoints: number;
}

/** Рейтинг по предмету */
export interface SubjectRating {
  subjectId: number;
  subjectName: string;
  entries: RatingEntry[];
}
