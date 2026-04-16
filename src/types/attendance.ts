/** Отметка посещаемости */
export type AttendanceMark = 'present' | 'absent';

/** Запись о посещаемости одного студента на одной паре */
export interface AttendanceRecord {
  studentId: number;
  studentName: string;
  lessonId: number;
  lessonDate: string;
  mark: AttendanceMark;
}

/** Данные для отметки посещаемости */
export interface SetAttendancePayload {
  lessonId: number;
  studentId: number;
  mark: AttendanceMark;
}
