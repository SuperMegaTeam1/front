'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { PageHero } from '@/components/ui';
import { getGroupJournal } from '@/lib/api/journal.api';
import { getStudentsByGroup } from '@/lib/api/users.api';
import type {
  GroupStudentListItem,
  GroupStudentsResponse,
  SaveLessonJournalPayload,
  ScheduleLessonResult,
  TodayScheduleResult,
  WeekScheduleResult,
} from '@/lib/api/types';
import { useSaveLessonJournal } from '@/lib/hooks/useTeacherJournal';
import { formatDateFull } from '@/lib/utils/formatDate';
import {
  formatJournalDisplayValue,
  parseJournalInput,
  sanitizeJournalValue,
} from '@/lib/utils/journal';
import {
  normalizeTeacherLessonGroups,
  parseTeacherLessonGroups,
  type TeacherLessonRouteContext,
} from '@/lib/utils/teacherLesson';
import styles from './lesson.module.scss';

interface GroupSectionData {
  groupId: string;
  groupName: string;
  students: GroupStudentListItem[];
}

type ScoreMap = Record<string, Record<string, string>>;

function formatStudentsCount(count: number) {
  const remainder10 = count % 10;
  const remainder100 = count % 100;

  if (remainder100 >= 11 && remainder100 <= 14) {
    return `${count} студентов`;
  }

  if (remainder10 === 1) {
    return `${count} студент`;
  }

  if (remainder10 >= 2 && remainder10 <= 4) {
    return `${count} студента`;
  }

  return `${count} студентов`;
}

function formatShortFullName(fullName: string) {
  const [lastName, firstName, fatherName] = fullName.trim().split(/\s+/);

  if (!lastName || !firstName) {
    return fullName;
  }

  return `${lastName} ${firstName[0]}.${fatherName ? ` ${fatherName[0]}.` : ''}`.trim();
}

function formatStudentFullName(student: GroupStudentListItem) {
  return `${student.lastName} ${student.firstName}${student.fatherName ? ` ${student.fatherName}` : ''}`.trim();
}

function buildLessonContext(lesson: ScheduleLessonResult, date: string): TeacherLessonRouteContext {
  return {
    lessonId: lesson.lessonsId,
    subjectId: lesson.subjectId,
    subjectName: lesson.subjectName,
    lessonType: lesson.type,
    date,
    startsAt: lesson.startsAt,
    endsAt: lesson.endsAt,
    cabinet: lesson.cabinet,
    groups: normalizeTeacherLessonGroups(lesson),
  };
}

function isTodayScheduleResult(value: unknown): value is TodayScheduleResult {
  return typeof value === 'object'
    && value !== null
    && Array.isArray((value as TodayScheduleResult).items)
    && typeof (value as TodayScheduleResult).date === 'string';
}

function isWeekScheduleResult(value: unknown): value is WeekScheduleResult {
  return typeof value === 'object'
    && value !== null
    && Array.isArray((value as WeekScheduleResult).items)
    && typeof (value as WeekScheduleResult).dateStart === 'string';
}

function findLessonInScheduleCache(queryClient: ReturnType<typeof useQueryClient>, lessonId: string) {
  const scheduleQueries = queryClient.getQueriesData<unknown>({ queryKey: ['schedule'] });

  for (const [, queryData] of scheduleQueries) {
    if (isTodayScheduleResult(queryData)) {
      const lesson = queryData.items.find((item) => item.lessonsId === lessonId);

      if (lesson) {
        return buildLessonContext(lesson, queryData.date);
      }
    }

    if (isWeekScheduleResult(queryData)) {
      for (const day of queryData.items) {
        const lesson = day.items.find((item) => item.lessonsId === lessonId);

        if (lesson) {
          return buildLessonContext(lesson, day.date);
        }
      }
    }
  }

  return null;
}

function GroupGradebook({
  group,
  scores,
  onScoreChange,
}: {
  group: GroupSectionData;
  scores: Record<string, string>;
  onScoreChange: (studentId: string, value: string) => void;
}) {
  return (
    <section className={styles.groupSection}>
      <header className={styles.groupHeader}>
        <h2 className={styles.groupTitle}>Группа {group.groupName}</h2>
        <span className={styles.studentsBadge}>{formatStudentsCount(group.students.length)}</span>
      </header>

      <div className={styles.gradebookCard}>
        <div className={styles.tableHeader}>
          <span className={styles.numCol}>№</span>
          <span className={styles.nameCol}>ФИО студента</span>
          <span className={styles.scoreCol}>Баллы / Н</span>
        </div>

        <div className={styles.tableBody}>
          {group.students.map((student, index) => {
            const fullName = formatStudentFullName(student);

            return (
              <div key={student.studentId} className={styles.row}>
                <span className={styles.numCell}>{index + 1}</span>
                <span className={styles.nameCell}>{formatShortFullName(fullName)}</span>
                <input
                  type="text"
                  className={styles.scoreInput}
                  placeholder="—"
                  value={scores[student.studentId] ?? ''}
                  onChange={(event) => onScoreChange(student.studentId, event.target.value)}
                  aria-label={`Значение для ${fullName}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function TeacherLessonPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const lessonId = params.id ?? '';
  const saveMutation = useSaveLessonJournal();
  const [draftScoresByGroup, setDraftScoresByGroup] = useState<ScoreMap>({});
  const [submitMessage, setSubmitMessage] = useState<{ type: 'idle' | 'info' | 'success' | 'error'; text: string }>({
    type: 'idle',
    text: '',
  });

  useEffect(() => {
    if (submitMessage.type !== 'success') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSubmitMessage({ type: 'idle', text: '' });
    }, 2500);

    return () => window.clearTimeout(timeoutId);
  }, [submitMessage]);

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
    queryFn: async () => {
      const results = await Promise.all(
        lessonGroups.map(async (group): Promise<GroupSectionData> => {
          const response = await getStudentsByGroup(group.groupId);
          const payload = response.data as GroupStudentsResponse;

          return {
            groupId: group.groupId,
            groupName: group.groupName,
            students: payload.items ?? [],
          };
        })
      );

      return results;
    },
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
          invalidInputs.push(formatStudentFullName(student));
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
      setSubmitMessage({
        type: 'info',
        text: 'Нет заполненных значений для отправки.',
      });
      return;
    }

    try {
      await saveMutation.mutateAsync({
        lessonId,
        payload: { items },
      });

      setSubmitMessage({
        type: 'success',
        text: 'Журнал занятия сохранён.',
      });
    } catch {
      setSubmitMessage({
        type: 'error',
        text: 'Не удалось сохранить журнал занятия.',
      });
    }
  };

  const lessonTitle = lessonContext.subjectName
    ? `${lessonContext.subjectName}${lessonContext.lessonType ? ` — ${lessonContext.lessonType}` : ''}`
    : 'Занятие';
  const lessonMeta = lessonContext.date
    ? `${formatDateFull(lessonContext.date)}${lessonContext.startsAt ? ` · ${lessonContext.startsAt}` : ''}${lessonContext.endsAt ? ` - ${lessonContext.endsAt}` : ''}`
    : 'Откройте занятие из расписания, чтобы подтянуть больше контекста.';

  const hasGroups = lessonGroups.length > 0;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero
          title={lessonTitle}
          meta={(
            <>
              <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
              <span>{lessonMeta}</span>
            </>
          )}
        />

        {!hasGroups ? (
          <section className={styles.stateCard}>
            Не удалось определить группы занятия. Откройте страницу пары из расписания преподавателя.
          </section>
        ) : groupsError ? (
          <section className={styles.stateCard}>
            Не удалось загрузить список студентов для этой пары.
          </section>
        ) : isGroupsLoading ? (
          <section className={styles.stateCard}>
            Загружаем студентов по группам…
          </section>
        ) : (
          groupSections.map((group) => (
            <GroupGradebook
              key={group.groupId}
              group={group}
              scores={Object.fromEntries(
                group.students.map((student) => [student.studentId, getScoreValue(group.groupId, student.studentId)])
              )}
              onScoreChange={(studentId, value) => handleScoreChange(group.groupId, studentId, value)}
            />
          ))
        )}

        <div className={styles.actions}>
          {submitMessage.type !== 'idle' && (
            <p
              className={`${styles.statusText} ${
                submitMessage.type === 'success'
                  ? styles.statusSuccess
                  : submitMessage.type === 'error'
                    ? styles.statusError
                    : ''
              }`}
            >
              {submitMessage.text}
            </p>
          )}
          <button
            type="button"
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={!hasGroups || isGroupsLoading || saveMutation.isPending || isMarksLoading}
          >
            <SendRoundedIcon sx={{ fontSize: 18 }} />
            {saveMutation.isPending ? 'Сохраняем…' : 'Отправить баллы'}
          </button>
        </div>
      </div>
    </div>
  );
}
