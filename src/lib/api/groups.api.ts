import api from './axios';
import type { TeacherGroupsResponse } from './types';

export const getTeacherGroups = () =>
  api.get<TeacherGroupsResponse>('/groups');
