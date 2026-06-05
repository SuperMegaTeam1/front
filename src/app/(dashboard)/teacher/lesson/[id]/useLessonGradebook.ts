'use client';

import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getGroupJournal } from '@/lib/api/journal.api';
import { getStudentsByGroup } from '@/lib/api/users.api';
import type { GroupStudentsResponse, SaveLessonJournalPayload } from '@/lib/api/types';
import { useSaveLessonJournal } from '@/lib/hooks/useTeacherJournal';
import { useStatusMessage } from '@/lib/hooks/useStatusMessage';
import { formatDateFull } from '@/lib/utils/formatDate';
import { joinFullName } from '@/lib/utils/fullName';
import {
  formatJournalDisplayValue,
  parseJournalInput,
  sanitizeJournalValue,
} from '@/lib/utils/journal';
import {
  parseTeacherLessonGroups,
  type TeacherLessonRouteContext,
} from '@/lib/utils/teacherLesson';
import { findLessonInScheduleCache } from './lessonContext';
import type { GroupSectionData } from './GroupGradebook';

type ScoreMap = Record<string, Record<string, string>>;

export function useLessonGradebook() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const lessonId = params.id ?? '';
  const saveMutation = useSaveLessonJournal();
  const { message: submitMessage, setMessage: setSubmitMessage } = useStatusMessage();
  const [draftScoresByGroup, setDraftScoresByGroup] = useState<ScoreMap>({});

  const cachedContext = useMemo(
    () => findLessonInScheduleCache(queryClient, lessonId),
    [lessonId, queryClient]
  );

  const searchGroups = useMemo(
    () => parseTeacherLessonGroups(searchParams.get('groups')),
    [searchParams]
  );

  const lessonContext = useMemo<TeacherLessonRouteContext>(() => ({
    lessonId,
    subjectId: searchParams.get('subjectId') ?? cachedContext?.subjectId,
    subjectName: searchParams.get('subjectName') ?? cachedContext?.subjectName,
    lessonType: searchParams.get('lessonType') ?? cachedContext?.lessonType,
    date: searchParams.get('date') ?? cachedContext?.date,
    startsAt: searchParams.get('startsAt') ?? cachedContext?.startsAt,
    endsAt: searchParams.get('endsAt') ?? cachedContext?.endsAt,
    cabinet: searchParams.get('cabinet') ?? cachedContext?.cabinet,
    groups: searchGroups.length > 0 ? searchGroups : (cachedContext?.groups ?? []),
  }), [cachedContext, lessonId, searchGroups, searchParams]);

  const lessonGroups = lessonContext.groups ?? [];
  const groupsKey = lessonGroups.map((group) => group.groupId).join(',');

  const {
    data: groupSections = [],
    isLoading: isGroupsLoading,
    error: groupsError,
  } = useQuery({
    queryKey: ['lesson', lessonId, 'groups', groupsKey],
    queryFn: async () => Promise.all(
      lessonGroups.map(async (group): Promise<GroupSectionData> => {
        const response = await getStudentsByGroup(group.groupId);
        const payload = response.data as GroupStudentsResponse;

        return {
          groupId: group.groupId,
          groupName: group.groupName,
          students: payload.items ?? [],
        };
      })
    ),
    enabled: lessonGroups.length > 0,
  });

  const {
    data: lessonMarksByGroup = [],
    isLoading: isMarksLoading,
  } = useQuery({
    queryKey: ['lesson', lessonId, 'journal', lessonContext.subjectId ?? '', groupsKey],
    queryFn: async () => Promise.all(
      lessonGroups.map(async (group) => ({
        groupId: group.groupId,
        items: (await getGroupJournal(lessonContext.subjectId!, group.groupId)).data.items
          .filter((item) => item.lessonId === lessonId),
      }))
    ),
    enabled: Boolean(lessonContext.subjectId && lessonGroups.length > 0),
  });

  const initialScoresByGroup = useMemo<ScoreMap>(() => {
    const journalValueMap = new Map<string, string>();

    for (const section of lessonMarksByGroup) {
      for (const item of section.items) {
        journalValueMap.set(
          `${section.groupId}:${item.studentId}`,
          formatJournalDisplayValue(item.attended, item.grade)
        );
      }
    }

    const next: ScoreMap = {};

    for (const section of groupSections) {
      next[section.groupId] = {};

      for (const student of section.students) {
        next[section.groupId][student.studentId] =
          journalValueMap.get(`${section.groupId}:${student.studentId}`) ?? '';
      }
    }

    return next;
  }, [groupSections, lessonMarksByGroup]);

  const getScoreValue = (groupId: string, studentId: string) =>
    draftScoresByGroup[groupId]?.[studentId]
    ?? initialScoresByGroup[groupId]?.[studentId]
    ?? '';

  const handleScoreChange = (groupId: string, studentId: string, value: string) => {
    setDraftScoresByGroup((prev) => ({
      ...prev,
      [groupId]: { ...(prev[groupId] ?? {}), [studentId]: sanitizeJournalValue(value) },
    }));
  };

  const handleSubmit = async () => {
    const invalidInputs: string[] = [];
    const items: SaveLessonJournalPayload['items'] = [];

    for (const section of groupSections) {
      for (const student of section.students) {
        const rawValue = getScoreValue(section.groupId, student.studentId);
        const parsed = parseJournalInput(rawValue);

        if (parsed === 'invalid') {
          invalidInputs.push(joinFullName(student.lastName, student.firstName, student.fatherName));
          continue;
        }

        items.push({
          studentId: student.studentId,
          attended: 'attended' in parsed ? parsed.attended : undefined,
          grade: 'grade' in parsed ? parsed.grade : null,
        });
      }
    }

    if (invalidInputs.length > 0) {
      setSubmitMessage({
        type: 'error',
        text: `Проверьте значения у студентов: ${invalidInputs.slice(0, 3).join(', ')}${invalidInputs.length > 3 ? '…' : ''}`,
      });
      return;
    }

    if (items.length === 0) {
      setSubmitMessage({ type: 'info', text: 'Нет заполненных значений для отправки.' });
      return;
    }

    try {
      await saveMutation.mutateAsync({ lessonId, payload: { items } });
      setSubmitMessage({ type: 'success', text: 'Журнал занятия сохранён.' });
    } catch {
      setSubmitMessage({ type: 'error', text: 'Не удалось сохранить журнал занятия.' });
    }
  };

  const lessonTitle = lessonContext.subjectName
    ? `${lessonContext.subjectName}${lessonContext.lessonType ? ` — ${lessonContext.lessonType}` : ''}`
    : 'Занятие';
  const lessonMeta = lessonContext.date
    ? `${formatDateFull(lessonContext.date)}${lessonContext.startsAt ? ` · ${lessonContext.startsAt}` : ''}${lessonContext.endsAt ? ` - ${lessonContext.endsAt}` : ''}`
    : 'Откройте занятие из расписания, чтобы подтянуть больше контекста.';

  return {
    groupSections,
    isGroupsLoading,
    groupsError,
    isMarksLoading,
    hasGroups: lessonGroups.length > 0,
    isSaving: saveMutation.isPending,
    submitMessage,
    lessonTitle,
    lessonMeta,
    getScoreValue,
    handleScoreChange,
    handleSubmit,
  };
}
