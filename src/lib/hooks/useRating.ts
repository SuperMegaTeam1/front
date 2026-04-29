'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyStudentRating } from '@/lib/api/rating.api';

export function useOverallRating() {
  return useQuery({
    queryKey: ['students', 'me', 'rating'],
    queryFn: () => getMyStudentRating().then((res) => res.data),
  });
}

export function useSubjectRating(subjectId: string) {
  return useQuery({
    queryKey: ['students', 'me', 'rating', subjectId],
    queryFn: () => getMyStudentRating(subjectId).then((res) => res.data),
    enabled: !!subjectId,
  });
}
