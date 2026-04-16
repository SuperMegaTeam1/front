/** Предмет (дисциплина) */
export interface Subject {
  id: number;
  name: string;
  description: string;
  teacherNames: string[];
}

/** Детали предмета для студента — с оценками и рейтингом */
export interface SubjectDetail extends Subject {
  totalPoints: number;
  maxPoints: number;
  ratingPosition: number | null;
  totalStudents: number;
}
