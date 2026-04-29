import type { ScheduleLessonCardData } from './ScheduleLessonCard';

export type DaySchedule = {
  date: string;
  lessons: ScheduleLessonCardData[];
};

export const TODAY_DATE = '2026-04-09';
export const WEEK_BASE_START = '2026-04-14';
export const WEEK_BASE_NUMBER = 16;

export const TODAY_LESSONS: ScheduleLessonCardData[] = [
  {
    id: 1,
    subjectId: 1,
    subjectName: 'Математический анализ',
    teacherName: 'Иванов И. И.',
    groupId: 9411,
    groupName: '09-411',
    date: TODAY_DATE,
    startTime: '08:30',
    endTime: '10:00',
    room: 'Ауд. 1108',
    lessonNumber: 1,
    lessonType: 'Лекция',
  },
  {
    id: 2,
    subjectId: 2,
    subjectName: 'Базы данных',
    teacherName: 'Сафиуллин Р. Н.',
    groupId: 9411,
    groupName: '09-411',
    date: TODAY_DATE,
    startTime: '10:20',
    endTime: '11:50',
    room: 'Ауд. 1101',
    lessonNumber: 2,
    lessonType: 'Лекция',
  },
  {
    id: 3,
    subjectId: 3,
    subjectName: 'Дискретная математика',
    teacherName: 'Новиков А. В.',
    groupId: 9411,
    groupName: '09-411',
    date: TODAY_DATE,
    startTime: '12:10',
    endTime: '13:40',
    room: 'Ауд. 602',
    lessonNumber: 3,
    lessonType: 'Практика',
  },
  {
    id: 4,
    subjectId: 4,
    subjectName: 'Программная инженерия',
    teacherName: 'Батрушина Г. С.',
    groupId: 9411,
    groupName: '09-411',
    date: TODAY_DATE,
    startTime: '14:00',
    endTime: '15:30',
    room: 'Ауд. 310',
    lessonNumber: 4,
    lessonType: 'Лабораторная',
  },
];

const WEEK_TEMPLATE: Omit<DaySchedule, 'date'>[] = [
  {
    lessons: [
      {
        id: 11,
        subjectId: 1,
        subjectName: 'Математический анализ',
        teacherName: 'Иванов И. И.',
        groupId: 9411,
        groupName: '09-411',
        date: '',
        startTime: '08:30',
        endTime: '10:00',
        room: 'Ауд. 1108',
        lessonNumber: 1,
        lessonType: 'Лекция',
      },
      {
        id: 12,
        subjectId: 2,
        subjectName: 'Базы данных',
        teacherName: 'Сафиуллин Р. Н.',
        groupId: 9411,
        groupName: '09-411',
        date: '',
        startTime: '10:20',
        endTime: '11:50',
        room: 'Ауд. 1101',
        lessonNumber: 2,
        lessonType: 'Лекция',
      },
    ],
  },
  {
    lessons: [
      {
        id: 13,
        subjectId: 3,
        subjectName: 'Дискретная математика',
        teacherName: 'Новиков А. В.',
        groupId: 9411,
        groupName: '09-411',
        date: '',
        startTime: '12:10',
        endTime: '13:40',
        room: 'Ауд. 602',
        lessonNumber: 3,
        lessonType: 'Практика',
      },
      {
        id: 14,
        subjectId: 4,
        subjectName: 'Программная инженерия',
        teacherName: 'Батрушина Г. С.',
        groupId: 9411,
        groupName: '09-411',
        date: '',
        startTime: '14:00',
        endTime: '15:30',
        room: 'Ауд. 310',
        lessonNumber: 4,
        lessonType: 'Лабораторная',
      },
    ],
  },
  {
    lessons: [],
  },
  {
    lessons: [
      {
        id: 15,
        subjectId: 5,
        subjectName: 'Численные методы',
        teacherName: 'Васильев Р. А.',
        groupId: 9411,
        groupName: '09-411',
        date: '',
        startTime: '08:30',
        endTime: '10:00',
        room: 'Ауд. 1109',
        lessonNumber: 1,
        lessonType: 'Лекция',
      },
    ],
  },
  {
    lessons: [
      {
        id: 16,
        subjectId: 6,
        subjectName: 'Операционные системы',
        teacherName: 'Кузнецов С. П.',
        groupId: 9411,
        groupName: '09-411',
        date: '',
        startTime: '10:20',
        endTime: '11:50',
        room: 'Ауд. 205',
        lessonNumber: 2,
        lessonType: 'Практика',
      },
    ],
  },
  {
    lessons: [],
  },
];

export function parseIsoDate(dateStr: string) {
  return new Date(`${dateStr}T12:00:00`);
}

export function shiftIsoDate(dateStr: string, days: number) {
  const date = parseIsoDate(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

export function buildWeek(offset: number): DaySchedule[] {
  const startDate = shiftIsoDate(WEEK_BASE_START, offset * 7);

  return WEEK_TEMPLATE.map((day, index) => {
    const date = shiftIsoDate(startDate, index);

    return {
      date,
      lessons: day.lessons.map((lesson) => ({
        ...lesson,
        date,
        id: lesson.id + offset * 100 + index * 10,
      })),
    };
  });
}
