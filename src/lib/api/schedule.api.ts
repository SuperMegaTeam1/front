import api from './axios';
import type { TodayScheduleResult, WeekScheduleResult } from './types';
import type { Role } from '@/types/user';

export function getTodaySchedule(date: string, role: Role) {
  const url =
    role === 'student'
      ? '/schedule/student/today'
      : '/schedule/teacher/today';

  return api.get<TodayScheduleResult>(url, {
    params: { date },
  });
}

export function getWeekSchedule(date: string, role: Role) {
  const url =
    role === 'student'
      ? '/schedule/student/week'
      : '/schedule/teacher/week';

  return api.get<WeekScheduleResult>(url, {
    params: { date },
  });
}