import type { User } from '@/types/user';

export type BackendRoleName = 'Student' | 'Teacher' | 'Admin' | string;

export interface LoginPayload {
  /**
   * Поле формы сейчас называется login, но реальный бэк ждет email.
   * Поэтому auth.api.ts мапит login -> email.
   */
  login: string;
  password: string;
}

export interface BackendLoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface AuthStudentMeResponse {
  id: string;
  roleName: BackendRoleName;
  firstName: string;
  lastName: string;
  fatherName: string | null;
  email: string;
  studentId: string | null;
  teacherId: string | null;
  groupId: string | null;
  groupName: string | null;
}

export interface AuthTeacherMeResponse {
  id: string;
  firstName: string;
  lastName: string;
  fatherName: string | null;
  email: string;
  teacherId: string | null;
}

export interface ScheduleLessonResult {
  lessonsId: string;
  subjectId: string;
  subjectName: string;

  teacherId?: string;
  teacherFirstName?: string;
  teacherLastName?: string;
  teacherFatherName?: string;

  cabinet: string | null;
  type: string | null;
  startsAt: string;
  endsAt: string;
}

export interface TodayScheduleResult {
  date: string;
  dayName: string;
  weekNumber: number | null;
  lessonsCount: number;
  items: ScheduleLessonResult[];
}

export interface WeekScheduleResult {
  dateStart: string;
  dateEnd: string;
  items: TodayScheduleResult[];
}

export interface SubjectDetailsResponse {
  id: string;
  name: string;
  groupId: string;
  groupName: string;
  teacherId: string;
  teacherFirstName: string;
  teacherLastName: string;
  teacherFatherName: string | null;
}

export interface TopStudentDto {
  studentId: string;
  firstName: string;
  lastName: string;
  fatherName: string | null;
  totalGrade: number;
  ratingPosition: number;
}

export interface StudentRatingResponse {
  groupId: string;
  groupName: string;
  subjectId: string | null;
  subjectName: string | null;
  ratingPosition: number;
  totalGrade: number;
  updatedAt: string;
  topStudents: TopStudentDto[];
}

export interface StudentSubjectListItem {
  subjectId: string;
  subjectName: string;
}

export interface StudentSubjectsResponse {
  items: StudentSubjectListItem[];
}

export interface TeacherSubjectGroupListItem {
  groupId?: string;
  groupName?: string;
  id?: string;
  name?: string;
}

export interface TeacherSubjectListItem {
  subjectId: string;
  subjectName: string;
  groups?: TeacherSubjectGroupListItem[];
  studyGroups?: TeacherSubjectGroupListItem[];
}

export interface TeacherSubjectsResponse {
  items: TeacherSubjectListItem[];
}

export interface BackendStatusResponse {
  service: string;
  status: string;
}

export function normalizeRole(roleName: BackendRoleName): User['role'] {
  return roleName.toLowerCase() === 'teacher' ? 'teacher' : 'student';
}

export function mapStudentMeToUser(authUser: AuthStudentMeResponse): User {
  return {
    id: authUser.id,
    login: authUser.email,
    firstName: authUser.firstName,
    lastName: authUser.lastName,
    patronymic: authUser.fatherName ?? '',
    phone: '',
    role: normalizeRole(authUser.roleName),
    email: authUser.email,
    studentId: authUser.studentId,
    teacherId: authUser.teacherId,
    groupId: authUser.groupId,
    groupName: authUser.groupName,
  };
}

export function mapTeacherMeToUser(authUser: AuthTeacherMeResponse): User {
  return {
    id: authUser.id,
    login: authUser.email,
    firstName: authUser.firstName,
    lastName: authUser.lastName,
    patronymic: authUser.fatherName ?? '',
    phone: '',
    role: 'teacher',
    email: authUser.email,
    teacherId: authUser.teacherId,
    studentId: null,
    groupId: null,
    groupName: null,
  };
}
