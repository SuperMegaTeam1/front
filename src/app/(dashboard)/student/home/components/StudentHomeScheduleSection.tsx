import { useEffect, useRef, useState } from 'react';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { LessonCard, type LessonCardProps } from '@/components/shared/LessonCard/LessonCard';
import { EmptyDayState, ScheduleCard } from '@/components/ui';
import { getRelativeScheduleDayLabel, getScheduleStageTag } from '@/lib/utils/schedule';
import styles from '../home.module.scss';

type NavigationDirection = 'previous' | 'next' | null;

export type StudentHomeScheduleDay = {
  date: string;
  lessons: Array<LessonCardProps & { id: string }>;
};

interface StudentHomeScheduleSectionProps {
  previousDay?: StudentHomeScheduleDay;
  currentDay: StudentHomeScheduleDay;
  nextDay?: StudentHomeScheduleDay;
  currentDayIndex: number;
  todayIndex: number;
  totalDays: number;
  isLoading: boolean;
  hasError: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

function getSidePreviewListClassName(lessonsCount: number) {
  return [
    styles.sidePreviewList,
    lessonsCount > 3 ? styles.sidePreviewListOverflow3 : '',
    lessonsCount > 4 ? styles.sidePreviewListOverflow4 : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function getAnimatedColumnClassName(baseClassName: string, direction: NavigationDirection) {
  return [
    baseClassName,
    direction === 'previous' ? styles.animatedColumnPrevious : '',
    direction === 'next' ? styles.animatedColumnNext : '',
  ]
    .filter(Boolean)
    .join(' ');
}

function parseLessonMeta(meta?: string) {
  if (!meta) {
    return {};
  }

  const [lessonType, teacherName] = meta.split(' • ');

  return {
    lessonType,
    teacherName,
  };
}

export function StudentHomeScheduleSection({
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
}: StudentHomeScheduleSectionProps) {
  const lastDayIndexRef = useRef(currentDayIndex);
  const [navigationDirection, setNavigationDirection] = useState<NavigationDirection>(null);

  useEffect(() => {
    setNavigationDirection(
      currentDayIndex > lastDayIndexRef.current
        ? 'next'
        : currentDayIndex < lastDayIndexRef.current
          ? 'previous'
          : null,
    );
    lastDayIndexRef.current = currentDayIndex;
  }, [currentDayIndex]);

  return (
    <section id="schedule" className={styles.scheduleStage}>
      <div className={styles.stageTag}>{getScheduleStageTag(currentDayIndex, todayIndex, currentDay.date)}</div>

      <div className={styles.stageLayout}>
        <div
          key={previousDay?.date ?? `student-previous-empty-${currentDay.date}`}
          className={[
            styles.sideColumn,
            styles.sideColumnLeft,
            getAnimatedColumnClassName(styles.animatedSideColumn, navigationDirection),
          ].join(' ')}
        >
          {previousDay ? (
            <>
              <div className={styles.sideLabel}>
                {getRelativeScheduleDayLabel(currentDayIndex - todayIndex - 1, previousDay.date).toUpperCase()}
              </div>
              <div className={getSidePreviewListClassName(previousDay.lessons.length)}>
                {previousDay.lessons.length > 0 ? (
                  previousDay.lessons.map((lesson) => (
                    <LessonCard key={lesson.id} {...lesson} variant="preview" />
                  ))
                ) : (
                  <EmptyDayState variant="compact" />
                )}
              </div>
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

        <div
          key={`student-current-${currentDay.date}`}
          className={[
            styles.todayColumn,
            getAnimatedColumnClassName(styles.animatedTodayColumn, navigationDirection),
          ].join(' ')}
        >
          {isLoading ? (
            <EmptyDayState title="Загружаем расписание" subtitle="" />
          ) : hasError ? (
            <EmptyDayState title="Не удалось загрузить расписание" subtitle="" />
          ) : currentDay.lessons.length > 0 ? (
            currentDay.lessons.map((lesson) => {
              const { lessonType, teacherName } = parseLessonMeta(lesson.meta);

              return (
                <ScheduleCard
                  key={lesson.id}
                  startTime={lesson.startTime}
                  endTime={lesson.endTime}
                  subjectName={lesson.subjectName}
                  lessonType={lessonType}
                  teacherName={teacherName}
                  room={lesson.room}
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

        <div
          key={nextDay?.date ?? `student-next-empty-${currentDay.date}`}
          className={[
            styles.sideColumn,
            styles.sideColumnRight,
            getAnimatedColumnClassName(styles.animatedSideColumn, navigationDirection),
          ].join(' ')}
        >
          {nextDay ? (
            <>
              <div className={styles.sideLabel}>
                {getRelativeScheduleDayLabel(currentDayIndex - todayIndex + 1, nextDay.date).toUpperCase()}
              </div>
              <div className={getSidePreviewListClassName(nextDay.lessons.length)}>
                {nextDay.lessons.length > 0 ? (
                  nextDay.lessons.map((lesson) => (
                    <LessonCard key={lesson.id} {...lesson} variant="preview" />
                  ))
                ) : (
                  <EmptyDayState variant="compact" />
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
