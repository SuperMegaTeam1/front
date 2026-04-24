import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { Grade, GradebookRow, SetGradePayload } from '@/types/grade';

/** Оценки студента по предмету */
export const getGradesBySubject = (subjectId: number) =>
  api.get<ApiResponse<Grade>>(`/grades/subject/${subjectId}`);

/** Журнал группы по предмету (для преподавателя) */
export const getGradebook = (subjectId: number, groupId: number) =>
  api.get<ApiResponse<GradebookRow[]>>(`/grades/gradebook/${subjectId}/${groupId}`);

/** Выставить баллы (преподаватель) */
export const setGrades = (payload: SetGradePayload[]) =>
  api.post('/grades', payload);
