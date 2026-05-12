'use client';

import { useQuery } from '@tanstack/react-query';
import { getTodaySchedule, getWeekSchedule } from '@/lib/api/schedule.api';

export function useDaySchedule(date: string) {
  return useQuery({
    queryKey: ['schedule', 'today', date],
    queryFn: () => getTodaySchedule(date).then((res) => res.data),
    enabled: !!date,
  });
}

export function useWeekSchedule(date: string, shouldFetch = true) {
  return useQuery({
    queryKey: ['schedule', 'week', date],
    queryFn: () => getWeekSchedule(date).then((res) => res.data),
    enabled: shouldFetch && !!date,
  });
}
