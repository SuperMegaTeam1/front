'use client';

import { useQuery } from '@tanstack/react-query';
import { getTodaySchedule } from '@/lib/api/schedule.api';

export function useDaySchedule(date: string) {
  return useQuery({
    queryKey: ['schedule', 'today', date],
    queryFn: () => getTodaySchedule(date).then((res) => res.data),
    enabled: !!date,
  });
}

export function useWeekSchedule(date: string) {
  return useQuery({
    queryKey: ['schedule', 'week', date],
    queryFn: async () => {
      throw new Error('Бэк пока не отдает расписание на неделю. Сейчас доступен только /schedule/today.');
    },
    enabled: false,
  });
}
