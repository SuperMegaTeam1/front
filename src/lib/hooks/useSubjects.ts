'use client';

import { useQuery } from '@tanstack/react-query';
import { getSubjects, getSubjectById } from '@/lib/api/subjects.api';

/** Хук: список предметов */
export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: () => getSubjects().then((res) => res.data.data),
  });
}

/** Хук: детали одного предмета */
export function useSubjectDetail(id: number) {
  return useQuery({
    queryKey: ['subjects', id],
    queryFn: () => getSubjectById(id).then((res) => res.data.data),
    enabled: !!id,
  });
}
