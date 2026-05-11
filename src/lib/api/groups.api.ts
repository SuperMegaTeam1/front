import api from './axios';
import type { TeacherGroupResponse } from './types';

/** Группы текущего преподавателя */
export const getTeacherGroups = () =>
  api.get<TeacherGroupResponse[]>('/groups');
