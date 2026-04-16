import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { User, Student } from '@/types/user';

/** Профиль текущего пользователя */
export const getProfile = () =>
  api.get<ApiResponse<User>>('/users/me');

/** Список студентов группы (для преподавателя) */
export const getStudentsByGroup = (groupId: number) =>
  api.get<ApiResponse<Student[]>>(`/users/students/${groupId}`);
