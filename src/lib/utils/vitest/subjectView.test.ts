import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import { describe, expect, it } from 'vitest';
import type {
  StudentRatingResponse,
  SubjectDetailsResponse,
  TeacherSubjectListItem,
} from '@/lib/api/types';
import {
  buildStudentSubjectDetailViewModel,
  buildTeacherSubjectCardViewModels,
  getSubjectTeacherName,
  mapSubjectJournalEntry,
  mapTeacherSubjectsToHomeSubjects,
} from '@/lib/utils/subjectView';

describe('subjectView utils', () => {
  describe('getSubjectTeacherName', () => {
    it('joins the teacher name in last-name-first order', () => {
      expect(getSubjectTeacherName('Иван', 'Петров', 'Сергеевич')).toBe('Петров Иван Сергеевич');
    });

    it('skips empty name parts', () => {
      expect(getSubjectTeacherName('Иван', null, undefined)).toBe('Иван');
    });
  });

  describe('mapSubjectJournalEntry', () => {
    it('formats a journal entry for display', () => {
      expect(mapSubjectJournalEntry('2026-09-01T00:00:00.000Z', 85, 2)).toEqual({
        id: '2026-09-01T00:00:00.000Z-2',
        date: '01.09.2026',
        points: 85,
      });
    });
  });

  describe('buildStudentSubjectDetailViewModel', () => {
    it('builds the detail view model and collapses long journal history', () => {
      const subjectDetail: SubjectDetailsResponse = {
        id: 'subject-1',
        name: 'Программная инженерия',
        groupId: 'group-1',
        groupName: '09-352',
        teacherId: 'teacher-1',
        teacherName: 'Иван',
        teacherLastName: 'Петров',
        teacherFatherName: 'Сергеевич',
        journalInfos: [
          { lessonsStartDate: '2026-09-01T00:00:00.000Z', studentGrade: 20 },
          { lessonsStartDate: '2026-09-08T00:00:00.000Z', studentGrade: null },
          { lessonsStartDate: '2026-09-15T00:00:00.000Z', studentGrade: 30 },
        ],
      };
      const subjectRating: StudentRatingResponse = {
        groupId: 'group-1',
        groupName: '09-352',
        subjectId: 'subject-1',
        subjectName: 'Программная инженерия',
        ratingPosition: 2,
        totalGrade: 50,
        updatedAt: '2026-09-15T10:00:00.000Z',
        topStudents: [
          {
            studentId: 'student-1',
            firstName: 'Анна',
            lastName: 'Иванова',
            fatherName: null,
            totalGrade: 90,
            ratingPosition: 1,
          },
          {
            studentId: 'student-2',
            firstName: 'Павел',
            lastName: 'Сидоров',
            fatherName: null,
            totalGrade: 50,
            ratingPosition: 2,
          },
        ],
      };

      const result = buildStudentSubjectDetailViewModel({
        subjectDetail,
        subjectRating,
        isExpanded: false,
        initialVisibleRows: 2,
      });

      expect(result).toMatchObject({
        subjectName: 'Программная инженерия',
        teacherName: 'Петров Иван Сергеевич',
        teacherSubtitle: 'Преподаватель: Петров Иван Сергеевич',
        currentScore: 50,
        currentScoreLabel: '50',
        maxScore: 100,
        progressWidth: '50%',
        groupName: '09-352',
        ratingPlace: 2,
        totalStudents: 2,
        ratingCaption: 'место среди 2 студентов',
        hasExtraRows: true,
      });
      expect(result.visibleEntries).toHaveLength(2);
      expect(result.journal).toHaveLength(3);
    });

    it('uses fallback values when subject data is incomplete', () => {
      const result = buildStudentSubjectDetailViewModel({
        subjectDetail: undefined,
        subjectRating: undefined,
        isExpanded: true,
      });

      expect(result).toMatchObject({
        subjectName: 'Предмет',
        teacherName: '',
        teacherSubtitle: 'Преподаватель не указан',
        currentScore: null,
        currentScoreLabel: '—',
        progressWidth: '0%',
        groupName: '',
        ratingPlace: null,
        totalStudents: 0,
        ratingCaption: 'место в группе пока недоступно',
        hasExtraRows: false,
      });
      expect(result.visibleEntries).toEqual([]);
    });

    it('clamps progress when the score exceeds the maximum', () => {
      const result = buildStudentSubjectDetailViewModel({
        subjectDetail: {
          id: 'subject-2',
          name: 'Алгоритмы',
          teacherId: 'teacher-2',
          teacherName: 'Мария',
          teacherLastName: 'Иванова',
          teacherFatherName: null,
          journalInfos: [
            { lessonsStartDate: '2026-09-01T00:00:00.000Z', studentGrade: 120 },
          ],
        },
        subjectRating: undefined,
        isExpanded: true,
      });

      expect(result.progressWidth).toBe('100%');
    });
  });

  describe('mapTeacherSubjectsToHomeSubjects', () => {
    it('maps teacher subjects into home cards with cycled variants', () => {
      const subjects: TeacherSubjectListItem[] = [
        {
          subjectId: 'subject-1',
          subjectName: 'TypeScript',
          groups: [{ groupId: 'g-1', groupName: '09-352' }],
        },
        {
          subjectId: 'subject-2',
          subjectName: 'Unknown subject',
          groups: [{ groupId: 'g-2', groupName: '09-353' }],
        },
      ];

      const result = mapTeacherSubjectsToHomeSubjects(subjects, ['brand', 'violet', 'mint']);

      expect(result).toEqual([
        {
          id: 'subject-1',
          name: 'TypeScript',
          groups: ['09-352'],
          icon: CodeOutlinedIcon,
          iconVariant: 'brand',
        },
        {
          id: 'subject-2',
          name: 'Unknown subject',
          groups: ['09-353'],
          icon: MenuBookOutlinedIcon,
          iconVariant: 'violet',
        },
      ]);
    });
  });

  describe('buildTeacherSubjectCardViewModels', () => {
    it('builds subject cards with group summary and links', () => {
      const result = buildTeacherSubjectCardViewModels([
        {
          subjectId: 'subject-1',
          subjectName: 'TypeScript',
          groups: [
            { groupId: 'g-1', groupName: '09-352' },
            { id: 'g-2', name: '09-353' },
          ],
        },
      ]);

      expect(result).toEqual([
        {
          subjectId: 'subject-1',
          subjectName: 'TypeScript',
          icon: CodeOutlinedIcon,
          groupCountLabel: '2 группы',
          groupsLabel: 'Группы',
          groupsSummary: '09-352, 09-353',
          hasGroups: true,
          groups: [
            {
              groupId: 'g-1',
              groupName: '09-352',
              href: {
                pathname: '/teacher/subjects/subject-1/g-1',
                query: {
                  subjectName: 'TypeScript',
                  groupName: '09-352',
                },
              },
            },
            {
              groupId: 'g-2',
              groupName: '09-353',
              href: {
                pathname: '/teacher/subjects/subject-1/g-2',
                query: {
                  subjectName: 'TypeScript',
                  groupName: '09-353',
                },
              },
            },
          ],
        },
      ]);
    });

    it('handles subjects without groups', () => {
      const result = buildTeacherSubjectCardViewModels([
        {
          subjectId: 'subject-2',
          subjectName: 'Unknown subject',
          groups: [],
        },
      ]);

      expect(result[0]).toMatchObject({
        groupCountLabel: '0 групп',
        groupsLabel: 'Группы',
        groupsSummary: 'пока не назначены',
        hasGroups: false,
        groups: [],
      });
    });
  });
});
