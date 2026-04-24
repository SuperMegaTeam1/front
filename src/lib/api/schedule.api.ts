import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { ScheduleDay, ScheduleWeek } from '@/types/schedule';

/** Расписание на конкретный день */
export const getScheduleByDate = (date: string) =>
  api.get<ApiResponse<ScheduleDay>>('/schedule/day', { params: { date } });

/** Расписание на неделю */
export const getWeekSchedule = (date: string) =>
  api.get<ApiResponse<ScheduleWeek>>('/schedule/week', { params: { date } });
