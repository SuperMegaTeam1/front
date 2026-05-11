'use client';

import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { LessonCard } from '@/components/shared/LessonCard/LessonCard';
import { EmptyDayState, ScheduleCard } from '@/components/ui';
import { getWeekDay } from '@/lib/utils/formatDate';
import styles from '../home.module.scss';
import type { TeacherHomeDay } from './TeacherHome.types';

interface TeacherHomeScheduleSectionProps {
  previousDay?: TeacherHomeDay;
  currentDay: TeacherHomeDay;
  nextDay?: TeacherHomeDay;
  currentDayIndex: number;
  todayIndex: number;
  totalDays: number;
  isLoading: boolean;
  hasError: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onLessonOpen: (lessonId: string) => void;
}

function getRelativeDayLabel(offset: number, fallbackDate: string) {
  if (offset === 0) return 'Сегодня';
  if (offset === -1) return 'Вчера';
  if (offset === 1) return 'Завтра';
  return getWeekDay(fallbackDate);
}

function getStageTag(index: number, todayIndex: number, date: string) {
  const offset = index - todayIndex;
  if (offset === 0) return 'ПАРЫ СЕГОДНЯ';
  if (offset === -1) return 'ПАРЫ ВЧЕРА';
  if (offset === 1) return 'ПАРЫ ЗАВТРА';
  return `РАСПИСАНИЕ НА ${getWeekDay(date).toUpperCase()}`;
}

function parseLessonMeta(meta?: string) {
  if (!meta) {
    return {};
  }

  const [lessonType, groups] = meta.split(' • ');

  return {
    lessonType,
    groups: groups?.replace(/\.$/, ''),
  };
}

export function TeacherHomeScheduleSection({
  previousDay,
  currentDay,
  nextDay,
  currentDayIndex,
  todayIndex,
  totalDays,
  isLoading,
  hasError,
  onPrevious,
  onNext,
  onLessonOpen,
}: TeacherHomeScheduleSectionProps) {
  return (
    <section id="schedule" className={styles.scheduleStage}>
      <div className={styles.stageTag}>{getStageTag(currentDayIndex, todayIndex, currentDay.date)}</div>

      <div className={styles.stageLayout}>
        <div className={`${styles.sideColumn} ${styles.sideColumnLeft}`}>
          {previousDay ? (
            <>
              <div className={styles.sideLabel}>
                {getRelativeDayLabel(currentDayIndex - todayIndex - 1, previousDay.date).toUpperCase()}
              </div>
              {previousDay.lessons.length > 0 ? (
                previousDay.lessons.map((lesson) => (
                  <LessonCard key={lesson.id} {...lesson} variant="preview" />
                ))
              ) : (
                <EmptyDayState variant="compact" />
              )}
            </>
          ) : null}
        </div>

        <button
          type="button"
          className={styles.arrowButton}
          aria-label="Показать предыдущий день"
          onClick={onPrevious}
          disabled={currentDayIndex === 0}
        >
          <ChevronLeftRoundedIcon sx={{ fontSize: 26 }} />
        </button>

        <div className={styles.todayColumn}>
          {isLoading ? (
            <EmptyDayState title="Загружаем расписание" subtitle="" />
          ) : hasError ? (
            <EmptyDayState title="Не удалось загрузить расписание" subtitle="" />
          ) : currentDay.lessons.length > 0 ? (
            currentDay.lessons.map((lesson) => {
              const { lessonType, groups } = parseLessonMeta(lesson.meta);

              return (
                <ScheduleCard
                  key={lesson.id}
                  startTime={lesson.startTime}
                  endTime={lesson.endTime}
                  subjectName={lesson.subjectName}
                  lessonType={lessonType}
                  room={lesson.room}
                  groups={groups}
                  onMore={() => onLessonOpen(lesson.id)}
                  moreLabel={`Открыть занятие: ${lesson.subjectName}`}
                />
              );
            })
          ) : (
            <EmptyDayState />
          )}
        </div>

        <button
          type="button"
          className={styles.arrowButton}
          aria-label="Показать следующий день"
          onClick={onNext}
          disabled={currentDayIndex === totalDays - 1}
        >
          <ChevronRightRoundedIcon sx={{ fontSize: 26 }} />
        </button>

        <div className={`${styles.sideColumn} ${styles.sideColumnRight}`}>
          {nextDay ? (
            <>
              <div className={styles.sideLabel}>
                {getRelativeDayLabel(currentDayIndex - todayIndex + 1, nextDay.date).toUpperCase()}
              </div>
              {nextDay.lessons.length > 0 ? (
                nextDay.lessons.map((lesson) => (
                  <LessonCard key={lesson.id} {...lesson} variant="preview" />
                ))
              ) : (
                <EmptyDayState variant="compact" />
              )}
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
