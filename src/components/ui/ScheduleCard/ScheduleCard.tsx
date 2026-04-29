'use client';

import type { ReactNode } from 'react';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import styles from './ScheduleCard.module.scss';

export interface ScheduleCardProps {
  startTime: string;
  endTime: string;
  subjectName: string;
  lessonType?: string;
  room?: string;
  teacherName?: string;
  groups?: string;
  onMore?: () => void;
  moreLabel?: string;
  extra?: ReactNode;
}

export function ScheduleCard({
  startTime,
  endTime,
  subjectName,
  lessonType,
  room,
  teacherName,
  groups,
  onMore,
  moreLabel,
  extra,
}: ScheduleCardProps) {
  return (
    <article className={styles.root}>
      <time className={styles.time}>
        {startTime}
        <span className={styles.timeDash}>—</span>
        {endTime}
      </time>

      <div className={styles.body}>
        <h2 className={styles.title}>{subjectName}</h2>

        <div className={styles.meta}>
          {lessonType && <span className={styles.metaItem}>{lessonType}</span>}
          {room && (
            <span className={styles.metaItem}>
              <LocationOnOutlinedIcon sx={{ fontSize: 14 }} />
              {room}
            </span>
          )}
          {teacherName && (
            <span className={styles.metaItem}>
              <PersonOutlineOutlinedIcon sx={{ fontSize: 14 }} />
              {teacherName}
            </span>
          )}
          {groups && (
            <span className={styles.metaItem}>
              <PeopleOutlineRoundedIcon sx={{ fontSize: 14 }} />
              {groups}
            </span>
          )}
        </div>

        {extra && <div className={styles.extra}>{extra}</div>}
      </div>

      {onMore && (
        <button
          type="button"
          className={styles.moreButton}
          aria-label={moreLabel ?? `Действия: ${subjectName}`}
          onClick={onMore}
        >
          <MoreHorizRoundedIcon sx={{ fontSize: 22 }} />
        </button>
      )}
    </article>
  );
}
