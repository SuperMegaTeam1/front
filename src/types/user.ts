/** Роль пользователя в системе */
export type Role = 'student' | 'teacher';

/** Базовая информация о пользователе */
export interface User {
  id: number;
  login: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  phone: string;
  role: Role;
}

/** Студент — расширение User с группой и рейтингом */
export interface Student extends User {
  role: 'student';
  groupId: number;
  groupName: string;
  overallRating: number | null;
}

/** Преподаватель — расширение User со списком предметов */
export interface Teacher extends User {
  role: 'teacher';
  subjectIds: number[];
}
