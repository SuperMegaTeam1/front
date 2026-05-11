import api from './axios';
import type { StudentMeSubjectsResponse, SubjectDetailsResponse } from './types';
import type { ApiResponse } from '@/types/api';
import type { Subject } from '@/types/subject';

/** Список предметов текущего студента */
export const getStudentMeSubjects = () =>
  api.get<StudentMeSubjectsResponse>('/students/me/subjects');

/** Список предметов текущего пользователя */
export const getSubjects = () =>
  api.get<ApiResponse<Subject[]>>('/subjects');

/** Детали предмета по ID (для студента: с баллами и рейтингом) */
export const getSubjectById = (id: string) =>
  api.get<SubjectDetailsResponse>(`/subjects/${id}`);
