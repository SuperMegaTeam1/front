import type { ReactNode } from 'react';
import type { SubjectCardProps } from '@/components/shared/SubjectCard/SubjectCard';

export interface TeacherHomeLesson {
  id: number;
  startTime: string;
  endTime: string;
  subjectName: string;
  meta?: string;
  room?: string;
  isActive?: boolean;
}

export interface TeacherHomeDay {
  label: string;
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
