'use client';

import { useQuery } from '@tanstack/react-query';
import { getOverallRating, getSubjectRating } from '@/lib/api/rating.api';

/** Хук: общий рейтинг */
export function useOverallRating() {
  return useQuery({
    queryKey: ['rating', 'overall'],
    queryFn: () => getOverallRating().then((res) => res.data.data),
  });
}

/** Хук: рейтинг по предмету */
export function useSubjectRating(subjectId: number) {
  return useQuery({
    queryKey: ['rating', 'subject', subjectId],
    queryFn: () => getSubjectRating(subjectId).then((res) => res.data.data),
    enabled: !!subjectId,
  });
}
