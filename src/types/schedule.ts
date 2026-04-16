/** Одно занятие (пара) в расписании */
export interface Lesson {
  id: number;
  subjectId: number;
  subjectName: string;
  teacherName: string;
  groupId: number;
  groupName: string;
  date: string;        // ISO 8601: "2026-04-16"
  startTime: string;   // "08:30"
  endTime: string;     // "10:00"
  room: string;
  lessonNumber: number; // Номер пары (1, 2, 3...)
}

/** Расписание на один день */
export interface ScheduleDay {
  date: string;
  lessons: Lesson[];
}

/** Расписание на неделю */
export interface ScheduleWeek {
  weekNumber: number;
  startDate: string;
  endDate: string;
  days: ScheduleDay[];
}
