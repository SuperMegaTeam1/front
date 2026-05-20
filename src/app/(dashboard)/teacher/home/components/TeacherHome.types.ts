import type { ReactNode } from 'react';
import type { SubjectCardProps } from '@/components/shared/SubjectCard/SubjectCard';
import type { TeacherHomeLessonView } from '@/lib/utils/scheduleView';

export type TeacherHomeLesson = TeacherHomeLessonView;

export interface TeacherHomeDay {
  date: string;
  lessons: TeacherHomeLesson[];
}

export interface TeacherHomeSubject {
  id: number | string;
  name: string;
  groups: string[];
  icon?: ReactNode;
  iconVariant?: SubjectCardProps['iconVariant'];
}
