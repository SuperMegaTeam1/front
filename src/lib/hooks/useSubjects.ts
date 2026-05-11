'use client';

import { useQuery } from '@tanstack/react-query';
import { getStudentMeSubjects, getSubjects, getSubjectById } from '@/lib/api/subjects.api';

/** Хук: список предметов текущего студента */
export function useStudentMeSubjects() {
  return useQuery({
    queryKey: ['subjects', 'student', 'me'],
    queryFn: () => getStudentMeSubjects().then((res) => res.data.items),
  });
}

/** Хук: список предметов */
export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: () => getSubjects().then((res) => res.data.data),
  });
}

/** Хук: детали одного предмета */
export function useSubjectDetail(id: string) {
  return useQuery({
    queryKey: ['subjects', id],
    queryFn: () => getSubjectById(id).then((res) => res.data),
    enabled: !!id,
  });
}
