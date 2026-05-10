import api from './axios';
import type { SubjectDetailsResponse } from './types';
import type { ApiResponse } from '@/types/api';
import type { Subject } from '@/types/subject';

/** Список предметов текущего пользователя */
export const getSubjects = () =>
  api.get<ApiResponse<Subject[]>>('/subjects');

/** Детали предмета по ID (для студента: с баллами и рейтингом) */
export const getSubjectById = (id: string) =>
  api.get<SubjectDetailsResponse>(`/subjects/${id}`);
