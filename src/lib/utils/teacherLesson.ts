import type { ScheduleLessonResult, ScheduleLessonGroupResult } from '@/lib/api/types';

export interface TeacherLessonGroupInfo {
  groupId: string;
  groupName: string;
}

export interface TeacherLessonRouteContext {
  lessonId: string;
  subjectId?: string;
  subjectName?: string;
  lessonType?: string | null;
  date?: string | null;
  startsAt?: string | null;
  endsAt?: string | null;
  cabinet?: string | null;
  groups?: TeacherLessonGroupInfo[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function normalizeGroupObject(group: ScheduleLessonGroupResult): TeacherLessonGroupInfo | null {
  const groupId = group.groupId ?? group.id;
  const groupName = group.groupName ?? group.name;

  if (!groupId || !groupName) {
    return null;
  }

  return { groupId, groupName };
}

export function normalizeTeacherLessonGroups(lesson: Partial<ScheduleLessonResult>): TeacherLessonGroupInfo[] {
  const rawGroups = Array.isArray(lesson.groups)
    ? lesson.groups
    : Array.isArray(lesson.studyGroups)
      ? lesson.studyGroups
      : [];

  const normalized = rawGroups
    .map((group) => {
      if (typeof group === 'string') {
        return null;
      }

      return normalizeGroupObject(group);
    })
    .filter((group): group is TeacherLessonGroupInfo => group !== null);

  if (normalized.length > 0) {
    return normalized;
  }

  if (Array.isArray(lesson.groupNames)) {
    return lesson.groupNames
      .map((groupName) => (typeof groupName === 'string' && groupName.trim()
        ? { groupId: groupName, groupName }
        : null))
      .filter((group): group is TeacherLessonGroupInfo => group !== null);
  }

  if (typeof lesson.groupName === 'string' && lesson.groupName.trim()) {
    return [{ groupId: lesson.groupName, groupName: lesson.groupName }];
  }

  return [];
}

export function formatTeacherLessonGroupNames(groups: TeacherLessonGroupInfo[]) {
  return groups.map((group) => group.groupName).join(', ');
}

export function buildTeacherLessonHref(context: TeacherLessonRouteContext) {
  const params = new URLSearchParams();

  if (context.subjectId) {
    params.set('subjectId', context.subjectId);
  }
  if (context.subjectName) {
    params.set('subjectName', context.subjectName);
  }
  if (context.lessonType) {
    params.set('lessonType', context.lessonType);
  }
  if (context.date) {
    params.set('date', context.date);
  }
  if (context.startsAt) {
    params.set('startsAt', context.startsAt);
  }
  if (context.endsAt) {
    params.set('endsAt', context.endsAt);
  }
  if (context.cabinet) {
    params.set('cabinet', context.cabinet);
  }
  if (context.groups && context.groups.length > 0) {
    params.set('groups', JSON.stringify(context.groups));
  }

  const query = params.toString();
  return query
    ? `/teacher/lesson/${context.lessonId}?${query}`
    : `/teacher/lesson/${context.lessonId}`;
}

export function parseTeacherLessonGroups(value: string | null): TeacherLessonGroupInfo[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((group) => {
        if (!isRecord(group)) {
          return null;
        }

        const groupId = typeof group.groupId === 'string' ? group.groupId : null;
        const groupName = typeof group.groupName === 'string' ? group.groupName : null;

        if (!groupId || !groupName) {
          return null;
        }

        return { groupId, groupName };
      })
      .filter((group): group is TeacherLessonGroupInfo => group !== null);
  } catch {
    return [];
  }
}
