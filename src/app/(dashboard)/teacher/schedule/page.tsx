'use client';

import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { useRouter } from 'next/navigation';
import { PageHero, ViewSwitch, WeekNavigation, ScheduleCard, DayDivider, EmptyDayState } from '@/components/ui';
import type { ScheduleLessonResult } from '@/lib/api/types';
import { SCHEDULE_VIEW_OPTIONS, useSchedulePage } from '@/lib/hooks/useSchedulePage';
import {
  formatScheduleDayTitle,
  formatScheduleHeadlineDate,
  formatScheduleWeekRange,
} from '@/lib/utils/schedule';
import { formatScheduleRoom } from '@/lib/utils/scheduleView';
import {
  buildTeacherLessonHref,
  formatTeacherLessonGroupNames,
  normalizeTeacherLessonGroups,
} from '@/lib/utils/teacherLesson';
import styles from './schedule.module.scss';

export default function TeacherSchedulePage() {
  const router = useRouter();
  const {
    view,
    setView,
    goToPreviousWeek,
    goToNextWeek,
    todayDate,
    todayLessons,
    isTodayScheduleLoading,
    todayScheduleError,
    displayWeekDays,
    isWeekScheduleLoading,
    weekScheduleError,
    headlineDate,
    isEvenWeek,
  } = useSchedulePage();

  const openLessonPage = (lesson: ScheduleLessonResult, date: string) => {
    router.push(buildTeacherLessonHref({
      lessonId: lesson.lessonsId,
      subjectId: lesson.subjectId,
      subjectName: lesson.subjectName,
      lessonType: lesson.type,
      date,
      startsAt: lesson.startsAt,
      endsAt: lesson.endsAt,
      cabinet: lesson.cabinet,
      groups: normalizeTeacherLessonGroups(lesson),
    }));
  };

  const heroMeta = view === 'today' ? (
    <>
      <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
      <span>{formatScheduleHeadlineDate(headlineDate)}</span>
    </>
  ) : (
    <span className={styles.weekMeta}>
      <strong className={styles.weekMetaLabel}>{isEvenWeek ? 'ЧЕТНАЯ НЕДЕЛЯ' : 'НЕЧЕТНАЯ НЕДЕЛЯ'}</strong>
      <span className={styles.weekMetaPeriod}>
        <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
        <span>{formatScheduleWeekRange(displayWeekDays).toUpperCase()}</span>
      </span>
    </span>
  );

  const heroCenter = view === 'week' ? (
    <WeekNavigation onPrevious={goToPreviousWeek} onNext={goToNextWeek} />
  ) : undefined;

  const heroAction = <ViewSwitch options={SCHEDULE_VIEW_OPTIONS} value={view} onChange={setView} />;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero
          className={styles.scheduleHero}
          title="Расписание"
          meta={heroMeta}
          center={heroCenter}
          action={heroAction}
        />

        {view === 'today' ? (
          <section className={styles.lessonList} aria-label="Расписание на сегодня">
            {isTodayScheduleLoading ? (
              <EmptyDayState title="Загружаем расписание" subtitle="Получаем данные с бэка" />
            ) : todayScheduleError ? (
              <EmptyDayState title="Не удалось загрузить расписание" subtitle="Проверьте запуск бэка и авторизацию" />
            ) : todayLessons.length > 0 ? (
              todayLessons.map((lesson) => (
                <ScheduleCard
                  key={lesson.lessonsId}
                  startTime={lesson.startsAt}
                  endTime={lesson.endsAt}
                  subjectName={lesson.subjectName}
                  lessonType={lesson.type ?? undefined}
                  room={formatScheduleRoom(lesson.cabinet)}
                  groups={formatTeacherLessonGroupNames(normalizeTeacherLessonGroups(lesson)) || undefined}
                  onMore={() => openLessonPage(lesson, todayDate)}
                  moreLabel={`Открыть занятие: ${lesson.subjectName}`}
                />
              ))
            ) : (
              <EmptyDayState title="На сегодня занятий нет" />
            )}
          </section>
        ) : (
          <section className={styles.weekList} aria-label="Расписание на неделю" aria-live="polite">
            {isWeekScheduleLoading ? (
              <EmptyDayState title="Загружаем неделю" subtitle="Получаем расписание с бэка" />
            ) : weekScheduleError ? (
              <EmptyDayState title="Не удалось загрузить неделю" subtitle="Проверьте запуск бэка и авторизацию" />
            ) : (
              displayWeekDays.map((day) => (
                <div key={day.date} className={styles.weekDay}>
                  <DayDivider label={formatScheduleDayTitle(day.date)} />
                  {day.lessons.length > 0 ? (
                    <div className={styles.dayLessons}>
                      {day.lessons.map((lesson) => (
                        <ScheduleCard
                          key={lesson.lessonsId}
                          startTime={lesson.startsAt}
                          endTime={lesson.endsAt}
                          subjectName={lesson.subjectName}
                          lessonType={lesson.type ?? undefined}
                          room={formatScheduleRoom(lesson.cabinet)}
                          groups={formatTeacherLessonGroupNames(normalizeTeacherLessonGroups(lesson)) || undefined}
                          onMore={() => openLessonPage(lesson, day.date)}
                          moreLabel={`Открыть занятие: ${lesson.subjectName}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyDayState />
                  )}
                </div>
              ))
            )}
          </section>
        )}
      </div>
    </div>
  );
}
