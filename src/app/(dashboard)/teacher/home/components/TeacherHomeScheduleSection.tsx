'use client';

import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { LessonCard } from '@/components/shared/LessonCard/LessonCard';
import { ScheduleCard } from '@/components/ui';
import styles from '../home.module.scss';
import type { TeacherHomeDay } from './TeacherHome.types';

interface TeacherHomeScheduleSectionProps {
  previousDay: TeacherHomeDay;
  currentDay: TeacherHomeDay;
  nextDay: TeacherHomeDay;
  onLessonOpen: (lessonId: number) => void;
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
  onLessonOpen,
}: TeacherHomeScheduleSectionProps) {
  return (
    <section id="schedule" className={styles.scheduleStage}>
      <div className={styles.stageTag}>ПАРЫ СЕГОДНЯ</div>

      <div className={styles.stageLayout}>
        <div className={`${styles.sideColumn} ${styles.sideColumnLeft}`}>
          <div className={styles.sideLabel}>{previousDay.label.toUpperCase()}</div>
          {previousDay.lessons.map((lesson) => (
            <LessonCard key={lesson.id} {...lesson} variant="preview" />
          ))}
        </div>

        <button type="button" className={styles.arrowButton} aria-label="Предыдущий день">
          <ChevronLeftRoundedIcon sx={{ fontSize: 26 }} />
        </button>

        <div className={styles.todayColumn}>
          {currentDay.lessons.map((lesson) => {
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
          })}
        </div>

        <button type="button" className={styles.arrowButton} aria-label="Следующий день">
          <ChevronRightRoundedIcon sx={{ fontSize: 26 }} />
        </button>

        <div className={`${styles.sideColumn} ${styles.sideColumnRight}`}>
          <div className={styles.sideLabel}>{nextDay.label.toUpperCase()}</div>
          {nextDay.lessons.map((lesson) => (
            <LessonCard key={lesson.id} {...lesson} variant="preview" />
          ))}
        </div>
      </div>
    </section>
  );
}
