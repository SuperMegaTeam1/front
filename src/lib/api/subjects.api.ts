import api from './axios';
import type { StudentSubjectsResponse, SubjectDetailsResponse, TeacherSubjectsResponse } from './types';
import type { ApiResponse } from '@/types/api';
import type { Subject } from '@/types/subject';

/** Список предметов текущего пользователя */
export const getSubjects = () =>
  api.get<ApiResponse<Subject[]>>('/subjects');

/** Детали предмета по ID (для студента: с баллами и рейтингом) */
export const getSubjectById = (id: string) =>
  api.get<SubjectDetailsResponse>(`/subjects/${id}`);

export const getMyStudentSubjects = () =>
  api.get<StudentSubjectsResponse>('/students/me/subjects');

export const getMyTeacherSubjects = () =>
  api.get<TeacherSubjectsResponse>('/teachers/me/subjects');
