import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { AttendanceRecord, SetAttendancePayload } from '@/types/attendance';

/** Посещаемость на конкретной паре */
export const getAttendanceByLesson = (lessonId: number) =>
  api.get<ApiResponse<AttendanceRecord[]>>(`/attendance/lesson/${lessonId}`);

/** Отметить посещаемость (преподаватель) */
export const setAttendance = (payload: SetAttendancePayload[]) =>
  api.post('/attendance', payload);
