import type { SvgIconComponent } from '@mui/icons-material';
import type {
  StudentRatingResponse,
  SubjectDetailsResponse,
  TeacherSubjectGroupListItem,
  TeacherSubjectListItem,
} from '@/lib/api/types';
import { sortGroupNames, sortGroupsByName } from '@/lib/utils/groupSort';
import { pluralizeRu } from '@/lib/utils/pluralize';
import { getSubjectIconByName } from '@/lib/utils/subjectIcons';

export interface SubjectGradeEntry {
  id: string;
  date: string;
  points: number | null;
}

export interface StudentSubjectDetailViewModel {
  subjectName: string;
  teacherName: string;
  teacherSubtitle: string;
  journal: SubjectGradeEntry[];
  visibleEntries: SubjectGradeEntry[];
  currentScore: number | null;
  currentScoreLabel: string;
  maxScore: number;
  progressWidth: string;
  groupName: string;
  ratingPlace: number | null;
  totalStudents: number;
  ratingCaption: string;
  hasExtraRows: boolean;
}

export interface TeacherHomeSubjectViewModel {
  id: string;
  name: string;
  groups: string[];
  icon: SvgIconComponent;
  iconVariant: 'brand' | 'violet' | 'mint';
}

export interface TeacherSubjectGroupLinkViewModel {
  groupId: string;
  groupName: string;
  href: {
    pathname: string;
    query: {
      subjectName: string;
      groupName: string;
    };
  };
}

export interface TeacherSubjectCardViewModel {
  subjectId: string;
  subjectName: string;
  icon: SvgIconComponent;
  groupCountLabel: string;
  groupsLabel: string;
  groupsSummary: string;
  hasGroups: boolean;
  groups: TeacherSubjectGroupLinkViewModel[];
}

const DEFAULT_VISIBLE_ROWS = 5;
const DEFAULT_MAX_SCORE = 100;
const DEFAULT_SUBJECT_NAME = 'Предмет';
const DEFAULT_TEACHER_SUBTITLE = 'Преподаватель не указан';
const DEFAULT_GROUP_SUMMARY = 'пока не назначены';
const EMPTY_GROUP_MESSAGE = 'место в группе пока недоступно';

function formatSubjectDate(date: string) {
  return new Date(date).toLocaleDateString('ru-RU');
}

function formatScore(score: number) {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

function clampProgress(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function getSubjectTeacherName(
  firstName?: string | null,
  lastName?: string | null,
  fatherName?: string | null,
) {
  return [lastName, firstName, fatherName].filter(Boolean).join(' ');
}

export function mapSubjectJournalEntry(
  lessonsStartDate: string,
  studentGrade: number | null,
  index: number,
): SubjectGradeEntry {
  return {
    id: `${lessonsStartDate}-${index}`,
    date: formatSubjectDate(lessonsStartDate),
    points: studentGrade,
  };
}

export function buildStudentSubjectDetailViewModel({
  subjectDetail,
  subjectRating,
  isExpanded,
  initialVisibleRows = DEFAULT_VISIBLE_ROWS,
  maxScore = DEFAULT_MAX_SCORE,
}: {
  subjectDetail?: SubjectDetailsResponse;
  subjectRating?: StudentRatingResponse;
  isExpanded: boolean;
  initialVisibleRows?: number;
  maxScore?: number;
}): StudentSubjectDetailViewModel {
  const journal = subjectDetail?.journalInfos.map((entry, index) =>
    mapSubjectJournalEntry(entry.lessonsStartDate, entry.studentGrade, index),
  ) ?? [];

  const teacherName = getSubjectTeacherName(
    subjectDetail?.teacherName,
    subjectDetail?.teacherLastName,
    subjectDetail?.teacherFatherName,
  );

  const currentScore = subjectDetail?.journalInfos.reduce(
    (sum, entry) => sum + (entry.studentGrade ?? 0),
    0,
  ) ?? null;
  const progressValue = ((currentScore ?? 0) / maxScore) * 100;
  const totalStudents = subjectRating?.topStudents.length ?? 0;

  return {
    subjectName: subjectDetail?.name ?? subjectRating?.subjectName ?? DEFAULT_SUBJECT_NAME,
    teacherName,
    teacherSubtitle: teacherName ? `Преподаватель: ${teacherName}` : DEFAULT_TEACHER_SUBTITLE,
    journal,
    visibleEntries: isExpanded ? journal : journal.slice(0, initialVisibleRows),
    currentScore,
    currentScoreLabel: currentScore === null ? '—' : formatScore(currentScore),
    maxScore,
    progressWidth: `${clampProgress(progressValue)}%`,
    groupName: subjectDetail?.groupName ?? subjectRating?.groupName ?? '',
    ratingPlace: subjectRating?.ratingPosition ?? null,
    totalStudents,
    ratingCaption: totalStudents > 0
      ? `место среди ${totalStudents} студентов`
      : EMPTY_GROUP_MESSAGE,
    hasExtraRows: journal.length > initialVisibleRows,
  };
}

export function mapTeacherSubjectsToHomeSubjects(
  subjects: TeacherSubjectListItem[],
  variants: ReadonlyArray<TeacherHomeSubjectViewModel['iconVariant']>,
): TeacherHomeSubjectViewModel[] {
  return subjects.map((subject, index) => ({
    id: subject.subjectId,
    name: subject.subjectName,
    groups: sortGroupNames(
      (Array.isArray(subject.groups) ? subject.groups : [])
        .map((group) => group.groupName ?? '')
        .filter(Boolean),
    ),
    icon: getSubjectIconByName(subject.subjectName),
    iconVariant: variants[index % variants.length] ?? 'brand',
  }));
}

export function getTeacherSubjectGroupCountLabel(groupsCount: number) {
  return `${groupsCount} ${pluralizeRu(groupsCount, ['группа', 'группы', 'групп'])}`;
}

export function getTeacherSubjectGroupsLabel(groupsCount: number) {
  return groupsCount === 1 ? 'Группа' : 'Группы';
}

function mapTeacherSubjectGroupLink(subjectId: string, subjectName: string, group: TeacherSubjectGroupListItem) {
  const groupId = group.groupId ?? group.id ?? '';
  const groupName = group.groupName ?? group.name ?? '';

  return {
    groupId,
    groupName,
    href: {
      pathname: `/teacher/subjects/${subjectId}/${groupId}`,
      query: {
        subjectName,
        groupName,
      },
    },
  };
}

export function buildTeacherSubjectCardViewModels(
  subjects: TeacherSubjectListItem[],
): TeacherSubjectCardViewModel[] {
  return subjects.map((subject) => {
    const groups = sortGroupsByName(
      (Array.isArray(subject.groups) ? subject.groups : [])
        .map((group) => mapTeacherSubjectGroupLink(subject.subjectId, subject.subjectName, group))
        .filter((group) => group.groupId && group.groupName),
    );
    const groupsCount = groups.length;

    return {
      subjectId: subject.subjectId,
      subjectName: subject.subjectName,
      icon: getSubjectIconByName(subject.subjectName),
      groupCountLabel: getTeacherSubjectGroupCountLabel(groupsCount),
      groupsLabel: getTeacherSubjectGroupsLabel(groupsCount),
      groupsSummary: groupsCount > 0
        ? groups.map((group) => group.groupName).join(', ')
        : DEFAULT_GROUP_SUMMARY,
      hasGroups: groupsCount > 0,
      groups,
    };
  });
}
