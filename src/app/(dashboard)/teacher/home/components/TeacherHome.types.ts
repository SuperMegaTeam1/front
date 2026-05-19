import type { ReactNode } from 'react';
import type { SubjectCardProps } from '@/components/shared/SubjectCard/SubjectCard';
import type { TeacherLessonGroupInfo } from '@/lib/utils/teacherLesson';

export interface TeacherHomeLesson {
  id: string;
  subjectId: string;
  startTime: string;
  endTime: string;
  subjectName: string;
  meta?: string;
  groups?: string[];
  groupInfos?: TeacherLessonGroupInfo[];
  room?: string;
  isActive?: boolean;
}

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
