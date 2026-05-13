import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { LessonCard, type LessonCardProps } from '@/components/shared/LessonCard/LessonCard';
import { EmptyDayState, ScheduleCard } from '@/components/ui';
import { getRelativeScheduleDayLabel, getScheduleStageTag } from '@/lib/utils/schedule';
import styles from '../home.module.scss';

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
  return (
    <section id="schedule" className={styles.scheduleStage}>
      <div className={styles.stageTag}>{getScheduleStageTag(currentDayIndex, todayIndex, currentDay.date)}</div>

      <div className={styles.stageLayout}>
        <div className={`${styles.sideColumn} ${styles.sideColumnLeft}`}>
          {previousDay ? (
            <>
              <div className={styles.sideLabel}>
                {getRelativeScheduleDayLabel(currentDayIndex - todayIndex - 1, previousDay.date).toUpperCase()}
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

        <div className={`${styles.sideColumn} ${styles.sideColumnRight}`}>
          {nextDay ? (
            <>
              <div className={styles.sideLabel}>
                {getRelativeScheduleDayLabel(currentDayIndex - todayIndex + 1, nextDay.date).toUpperCase()}
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
