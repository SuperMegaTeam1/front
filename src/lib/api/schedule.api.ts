import api from './axios';
import type { TodayScheduleResult } from './types';

export function getTodaySchedule(date?: string) {
  return api.get<TodayScheduleResult>('/schedule/today', {
    params: date ? { date } : undefined,
  });
}

export const getScheduleByDate = getTodaySchedule;
