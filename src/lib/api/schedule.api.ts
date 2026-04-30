import api from './axios';
import type { TodayScheduleResult, WeekScheduleResult } from './types';

export function getTodaySchedule(date?: string) {
  return api.get<TodayScheduleResult>('/schedule/today', {
    params: date ? { date } : undefined,
  });
}

export const getScheduleByDate = getTodaySchedule;

export function getWeekSchedule(date?: string) {
  return api.get<WeekScheduleResult>('/schedule/week', {
    params: date ? { date } : undefined,
  });
}
