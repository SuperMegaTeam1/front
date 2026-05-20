import { describe, expect, it } from 'vitest';
import {
  mapStudentMeToUser,
  mapTeacherMeToUser,
  normalizeGroupStudentsResponse,
  normalizeRole,
  type AuthStudentMeResponse,
  type AuthTeacherMeResponse,
  type GroupStudentsResponse,
  type RawGroupStudentListItem,
} from '@/lib/api/types';

describe('api type mappers', () => {
  describe('normalizeRole', () => {
    it('returns teacher for teacher role names', () => {
      expect(normalizeRole('Teacher')).toBe('teacher');
      expect(normalizeRole('teacher')).toBe('teacher');
    });

    it('returns student for student and unknown role names', () => {
      expect(normalizeRole('Student')).toBe('student');
      expect(normalizeRole('Admin')).toBe('student');
    });
  });

  describe('mapStudentMeToUser', () => {
    it('maps student payload fields into the app user shape', () => {
      const authUser: AuthStudentMeResponse = {
        id: 'user-1',
        roleName: 'Student',
        firstName: 'Ivan',
        lastName: 'Petrov',
        fatherName: 'Sergeevich',
        email: 'ivan@example.com',
        studentId: 'student-1',
        teacherId: null,
        groupId: 'group-1',
        groupName: '09-352',
      };

      expect(mapStudentMeToUser(authUser)).toEqual({
        id: 'user-1',
        login: 'ivan@example.com',
        firstName: 'Ivan',
        lastName: 'Petrov',
        patronymic: 'Sergeevich',
        role: 'student',
        email: 'ivan@example.com',
        studentId: 'student-1',
        teacherId: null,
        groupId: 'group-1',
        groupName: '09-352',
      });
    });

    it('falls back to an empty patronymic when fatherName is null', () => {
      const authUser: AuthStudentMeResponse = {
        id: 'user-2',
        roleName: 'Teacher',
        firstName: 'Anna',
        lastName: 'Sidorova',
        fatherName: null,
        email: 'anna@example.com',
        studentId: null,
        teacherId: 'teacher-2',
        groupId: null,
        groupName: null,
      };

      expect(mapStudentMeToUser(authUser)).toMatchObject({
        patronymic: '',
        role: 'teacher',
        teacherId: 'teacher-2',
      });
    });
  });

  describe('mapTeacherMeToUser', () => {
    it('maps teacher payload fields into the app user shape', () => {
      const authUser: AuthTeacherMeResponse = {
        id: 'teacher-user-1',
        firstName: 'Elena',
        lastName: 'Smirnova',
        fatherName: 'Ivanovna',
        email: 'elena@example.com',
        teacherId: 'teacher-1',
      };

      expect(mapTeacherMeToUser(authUser)).toEqual({
        id: 'teacher-user-1',
        login: 'elena@example.com',
        firstName: 'Elena',
        lastName: 'Smirnova',
        patronymic: 'Ivanovna',
        role: 'teacher',
        email: 'elena@example.com',
        teacherId: 'teacher-1',
        studentId: null,
        groupId: null,
        groupName: null,
      });
    });

    it('falls back to an empty patronymic and always keeps teacher role', () => {
      const authUser: AuthTeacherMeResponse = {
        id: 'teacher-user-2',
        firstName: 'Pavel',
        lastName: 'Volkov',
        fatherName: null,
        email: 'pavel@example.com',
        teacherId: null,
      };

      expect(mapTeacherMeToUser(authUser)).toMatchObject({
        patronymic: '',
        role: 'teacher',
        studentId: null,
        groupId: null,
        groupName: null,
      });
    });
  });

  describe('normalizeGroupStudentsResponse', () => {
    it('normalizes the raw array response into the items shape', () => {
      const payload: RawGroupStudentListItem[] = [
        {
          id: 'student-1',
          firstName: 'Ivan',
          lastName: 'Petrov',
          fatherName: '',
          email: 'ivan@example.com',
        },
      ];

      expect(normalizeGroupStudentsResponse(payload)).toEqual({
        items: [
          {
            studentId: 'student-1',
            firstName: 'Ivan',
            lastName: 'Petrov',
            fatherName: null,
          },
        ],
      });
    });

    it('normalizes the object response and preserves known student ids', () => {
      const payload: GroupStudentsResponse = {
        items: [
          {
            studentId: 'student-2',
            firstName: 'Maria',
            lastName: 'Ivanova',
            fatherName: 'Petrovna',
          },
        ],
      };

      expect(normalizeGroupStudentsResponse(payload)).toEqual(payload);
    });

    it('returns an empty items array when the object response has no items field', () => {
      expect(normalizeGroupStudentsResponse({} as GroupStudentsResponse)).toEqual({
        items: [],
      });
    });
  });
});
