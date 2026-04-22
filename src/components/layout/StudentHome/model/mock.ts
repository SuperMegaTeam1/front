import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import GradingRoundedIcon from '@mui/icons-material/GradingRounded';
import MeetingRoomRoundedIcon from '@mui/icons-material/MeetingRoomRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';

export const studentHomeGreeting = {
  title: 'Добрый день, Тимур',
  subtitle: 'Среда, 9 апреля · Неделя 10 · 3 занятия сегодня',
  actionLabel: 'Перейти в расписание',
  actionHref: '/student/schedule',
};

export const todayLessons = [
  {
    time: '10:20 — 11:50',
    title: 'Базы данных',
    description: 'Лекция · Сафиуллин Р.Н.',
    room: 'Ауд. 1101',
  },
  {
    time: '12:10 — 13:40',
    title: 'Дискретная математика',
    description: 'Практика · Новиков А.В.',
    room: 'Ауд. 602',
  },
  {
    time: '14:00 — 15:30',
    title: 'Программная инженерия',
    description: 'Лабораторная · Барышина Г.С.',
    room: 'Ауд. 310',
  },
];

export const previousLessons = [
  { time: '08:30 — 10:00', title: 'Базы данных' },
  { time: '10:10 — 11:40', title: 'Математика' },
];

export const nextLessons = [
  { time: '10:20 — 11:50', title: 'Базы данных' },
  { time: '12:10 — 13:40', title: 'Программная инженерия' },
];

export const performanceSummary = {
  score: 74.2,
  scoreLabel: 'Средний балл',
  position: '12 из 87',
  positionLabel: 'Группа 09-411',
  actionLabel: 'Смотреть подробный рейтинг',
  actionHref: '/student/rating',
};

export const performanceSubjects = [
  { title: 'Базы данных', score: 82 },
  { title: 'Дискретная математика', score: 71 },
  { title: 'Программная инженерия', score: 63 },
];

export const recentUpdates = [
  {
    title: 'Добавлены баллы: +5 по Базам данных',
    description: 'Раздел: Практическая работа №4',
    time: '2 ч назад',
    icon: GradingRoundedIcon,
  },
  {
    title: 'Изменена аудитория: Дискретная математика',
    description: 'Новая локация: Ауд. 602 (вместо 604)',
    time: 'Вчера',
    icon: MeetingRoomRoundedIcon,
  },
  {
    title: 'Опубликовано новое задание: Программная инженерия',
    description: 'Срок сдачи: 16 апреля',
    time: 'Вчера',
    icon: DescriptionRoundedIcon,
  },
  {
    title: 'Зачет подтвержден: Физкультура',
    description: 'Преподаватель: Смирнов Д.А.',
    time: '2 дня назад',
    icon: VerifiedRoundedIcon,
  },
];
