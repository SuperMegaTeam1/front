import api from './axios';
import type { TodayScheduleResult, WeekScheduleResult } from './types';

export type ScheduleRole = 'student' | 'teacher';

export function getTodaySchedule(role: ScheduleRole, date?: string) {
  return api.get<TodayScheduleResult>(`/schedule/${role}/today`, {
    params: date ? { date } : undefined,
  });
}

export const getScheduleByDate = getTodaySchedule;

export function getWeekSchedule(role: ScheduleRole, date?: string) {
  return api.get<WeekScheduleResult>(`/schedule/${role}/week`, {
    params: date ? { date } : undefined,
  });
}
