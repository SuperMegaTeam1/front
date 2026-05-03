'use client';

import { useState } from 'react';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import Link from 'next/link';
import {
  PageHero,
  ViewSwitch,
  DayDivider,
  EmptyDayState,
  ScheduleCard,
  InfoCard,
  FieldItem,
  LogoutButton,
} from '@/components/ui';
import styles from './ui-test.module.scss';

type ScheduleView = 'today' | 'week';

const MOCK_LESSONS = [
  {
    id: 1,
    startTime: '08:30',
    endTime: '10:00',
    subjectName: 'Математический анализ',
    lessonType: 'Лекция',
    room: 'Ауд. 1108',
    teacherName: 'Иванов И. И.',
  },
  {
    id: 2,
    startTime: '10:20',
    endTime: '11:50',
    subjectName: 'Базы данных',
    lessonType: 'Практика',
    room: 'Ауд. 1101',
    teacherName: 'Сафиуллин Р. Н.',
  },
];

const MOCK_TEACHER_LESSONS = [
  {
    id: 3,
    startTime: '12:10',
    endTime: '13:40',
    subjectName: 'Дискретная математика',
    lessonType: 'Практика',
    room: 'Ауд. 602',
    groups: '09-352, 09-353',
  },
];

const VIEW_OPTIONS: Array<{ value: ScheduleView; label: string }> = [
  { value: 'today', label: 'Сегодня' },
  { value: 'week', label: 'Неделя' },
];

export default function UiTestPage() {
  const [scheduleView, setScheduleView] = useState<ScheduleView>('today');

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.sectionLabel}>← <Link href="/teacher/schedule">Назад</Link> &nbsp;|&nbsp; UI Kit — тестовая страница</h2>

        {/* PageHero — варианты */}
        <section className={styles.group}>
          <p className={styles.groupTitle}>PageHero</p>
          <div className={styles.stack}>
            <PageHero title="Расписание" subtitle="Текущий семестр" />
            <PageHero
              title="Профиль"
              subtitle="Личные и учебные данные"
            />
            <PageHero
              title="Расписание"
              meta={
                <>
                  <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
                  <span>СРЕДА, 9 АПРЕЛЯ</span>
                </>
              }
              action={
                <ViewSwitch
                  options={VIEW_OPTIONS}
                  value={scheduleView}
                  onChange={setScheduleView}
                />
              }
            />
          </div>
        </section>

        {/* ViewSwitch */}
        <section className={styles.group}>
          <p className={styles.groupTitle}>ViewSwitch</p>
          <div className={styles.row}>
            <ViewSwitch
              options={VIEW_OPTIONS}
              value={scheduleView}
              onChange={setScheduleView}
            />
            <ViewSwitch
              options={[
                { value: 'list', label: 'Список' },
                { value: 'grid', label: 'Сетка' },
                { value: 'table', label: 'Таблица' },
              ]}
              value="list"
              onChange={() => {}}
            />
          </div>
        </section>

        {/* DayDivider */}
        <section className={styles.group}>
          <p className={styles.groupTitle}>DayDivider</p>
          <div className={styles.stack}>
            <DayDivider label="Понедельник, 13 апреля" />
            <DayDivider label="СРЕДА, 15 АПРЕЛЯ" />
          </div>
        </section>

        {/* EmptyDayState */}
        <section className={styles.group}>
          <p className={styles.groupTitle}>EmptyDayState</p>
          <div className={styles.stack}>
            <EmptyDayState />
            <EmptyDayState title="Нет уведомлений" subtitle="Все уведомления прочитаны" />
          </div>
        </section>

        {/* ScheduleCard — студент (с teacherName) */}
        <section className={styles.group}>
          <p className={styles.groupTitle}>ScheduleCard — студент (с именем преподавателя)</p>
          <div className={styles.stack}>
            {MOCK_LESSONS.map((lesson) => (
              <ScheduleCard
                key={lesson.id}
                startTime={lesson.startTime}
                endTime={lesson.endTime}
                subjectName={lesson.subjectName}
                lessonType={lesson.lessonType}
                room={lesson.room}
                teacherName={lesson.teacherName}
                onMore={() => {}}
                moreLabel={`Перейти к ${lesson.subjectName}`}
              />
            ))}
          </div>
        </section>

        {/* ScheduleCard — преподаватель (с группами) */}
        <section className={styles.group}>
          <p className={styles.groupTitle}>ScheduleCard — преподаватель (с группами)</p>
          <div className={styles.stack}>
            {MOCK_TEACHER_LESSONS.map((lesson) => (
              <ScheduleCard
                key={lesson.id}
                startTime={lesson.startTime}
                endTime={lesson.endTime}
                subjectName={lesson.subjectName}
                lessonType={lesson.lessonType}
                room={lesson.room}
                groups={lesson.groups}
                onMore={() => {}}
              />
            ))}
            <ScheduleCard
              startTime="14:00"
              endTime="15:30"
              subjectName="Программная инженерия"
              lessonType="Лабораторная"
              room="Ауд. 310"
              groups="09-352, 09-353"
            />
          </div>
        </section>

        {/* DayDivider + ScheduleCard + EmptyDayState — вместе, как в расписании */}
        <section className={styles.group}>
          <p className={styles.groupTitle}>DayDivider + ScheduleCard + EmptyDayState — как в расписании</p>
          <div className={styles.stack}>
            <DayDivider label="Понедельник, 13 апреля" />
            <div className={styles.lessonList}>
              {MOCK_LESSONS.map((lesson) => (
                <ScheduleCard
                  key={lesson.id}
                  startTime={lesson.startTime}
                  endTime={lesson.endTime}
                  subjectName={lesson.subjectName}
                  lessonType={lesson.lessonType}
                  room={lesson.room}
                  teacherName={lesson.teacherName}
                  onMore={() => {}}
                />
              ))}
            </div>
            <DayDivider label="Вторник, 14 апреля" />
            <EmptyDayState />
          </div>
        </section>

        {/* InfoCard + FieldItem */}
        <section className={styles.group}>
          <p className={styles.groupTitle}>InfoCard + FieldItem</p>
          <div className={styles.stack}>
            <InfoCard title="Учебная программа" icon={<SchoolOutlinedIcon sx={{ fontSize: 22 }} />}>
              <div className={styles.fieldGrid}>
                <FieldItem label="Группа" value="09-411" />
                <FieldItem label="Курс" value="3 курс" />
                <FieldItem label="Направление" value="Программная инженерия" />
                <FieldItem label="Семестр" value="6 семестр" />
                <FieldItem label="Форма обучения" value="Очная форма" />
              </div>
            </InfoCard>
            <InfoCard title="Контактные данные" variant="white">
              <div className={styles.fieldGrid2}>
                <FieldItem label="Почта" value="t.saf@stud.kpfu.ru" />
                <FieldItem label="Телефон" value="+7 900 123-45-67" />
              </div>
            </InfoCard>
          </div>
        </section>

        {/* LogoutButton */}
        <section className={styles.group}>
          <p className={styles.groupTitle}>LogoutButton</p>
          <div className={styles.row}>
            <LogoutButton onClick={() => {}} />
          </div>
        </section>
      </div>
    </div>
  );
}
