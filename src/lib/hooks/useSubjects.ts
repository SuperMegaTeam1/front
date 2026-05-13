'use client';

import { useQuery } from '@tanstack/react-query';
import { getMyStudentSubjects, getMyTeacherSubjects, getSubjects, getSubjectById } from '@/lib/api/subjects.api';
import type { TeacherSubjectGroupListItem } from '@/lib/api/types';

function normalizeTeacherSubjectGroups(subject: {
  groups?: TeacherSubjectGroupListItem[];
  studyGroups?: TeacherSubjectGroupListItem[];
}) {
  const rawGroups = Array.isArray(subject.groups)
    ? subject.groups
    : Array.isArray(subject.studyGroups)
      ? subject.studyGroups
      : [];

  return rawGroups
    .map((group) => {
      const groupId = group.groupId ?? group.id;
      const groupName = group.groupName ?? group.name;

      if (!groupId || !groupName) {
        return null;
      }

      return { groupId, groupName };
    })
    .filter((group): group is { groupId: string; groupName: string } => group !== null);
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

export function useMyStudentSubjects() {
  return useQuery({
    queryKey: ['students', 'me', 'subjects'],
    queryFn: () => getMyStudentSubjects().then((res) => res.data.items ?? []),
  });
}

export function useMyTeacherSubjects() {
  return useQuery({
    queryKey: ['teachers', 'me', 'subjects'],
    queryFn: () =>
      getMyTeacherSubjects().then((res) =>
        (res.data.items ?? []).map((subject) => ({
          ...subject,
          groups: normalizeTeacherSubjectGroups(subject),
        })),
      ),
  });
}
