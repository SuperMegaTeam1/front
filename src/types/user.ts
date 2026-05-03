export type Role = 'student' | 'teacher';
export type EntityId = string | number;

export interface User {
  id: EntityId;
  login: string;
  firstName: string;
  lastName: string;
  patronymic: string;
  phone: string;
  role: Role;
  email?: string;
  studentId?: string | null;
  teacherId?: string | null;
  groupId?: EntityId | null;
  groupName?: string | null;
}

export interface Student extends User {
  role: 'student';
  groupId: EntityId;
  groupName: string;
  overallRating: number | null;
}

export interface Teacher extends User {
  role: 'teacher';
  subjectIds: EntityId[];
}
