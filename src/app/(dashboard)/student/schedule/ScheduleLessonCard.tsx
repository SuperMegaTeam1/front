'use client';

import { Typography } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import type { Lesson } from '@/types/schedule';
import styles from './schedule.module.scss';

export type ScheduleLessonCardData = Lesson & {
  lessonType?: string;
  type?: string;
};

interface ScheduleLessonCardProps {
  lesson: ScheduleLessonCardData;
}

function getLessonType(lesson: ScheduleLessonCardData) {
  return lesson.lessonType ?? lesson.type ?? `Пара ${lesson.lessonNumber}`;
}

export function ScheduleLessonCard({ lesson }: ScheduleLessonCardProps) {
  return (
    <article className={styles.lessonCard}>
      <div className={styles.timeBlock}>
        <span>{lesson.startTime}</span>
        <span className={styles.timeDash}>—</span>
        <span>{lesson.endTime}</span>
      </div>

      <div className={styles.lessonContent}>
        <Typography component="h2" className={styles.lessonTitle}>
          {lesson.subjectName}
        </Typography>

        <div className={styles.lessonMeta}>
          <span className={styles.metaText}>{getLessonType(lesson)}</span>
          <span className={styles.metaItem}>
            <LocationOnOutlinedIcon sx={{ fontSize: 14 }} />
            {lesson.room}
          </span>
          <span className={styles.metaItem}>
            <PersonOutlineOutlinedIcon sx={{ fontSize: 14 }} />
            {lesson.teacherName}
          </span>
        </div>
      </div>

      <button type="button" className={styles.moreButton} aria-label={`Подробнее о занятии ${lesson.subjectName}`}>
        <MoreHorizRoundedIcon sx={{ fontSize: 22 }} />
      </button>
    </article>
  );
}
