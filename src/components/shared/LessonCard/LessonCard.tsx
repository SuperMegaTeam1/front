import styles from './LessonCard.module.scss';

export interface LessonCardProps {
  startTime: string;
  endTime: string;
  subjectName: string;
  meta?: string;
  lessonType?: string;
  groups?: string[];
  room?: string;
  variant?: 'hero' | 'preview';
  isActive?: boolean;
}

export function LessonCard({
  startTime,
  endTime,
  subjectName,
  meta,
  lessonType,
  groups,
  room,
  variant = 'hero',
  isActive = false,
}: LessonCardProps) {
  const timeRange = `${startTime} — ${endTime}`;
  const resolvedMeta = meta ?? [lessonType, groups?.length ? groups.join(', ') : undefined]
    .filter(Boolean)
    .join(' • ');

  if (variant === 'preview') {
    return (
      <article className={`${styles.root} ${styles.preview} ${isActive ? styles.active : ''}`}>
        <span className={styles.previewTime}>{timeRange}</span>
        <p className={styles.previewSubject}>{subjectName}</p>
      </article>
    );
  }

  return (
    <article className={`${styles.root} ${styles.hero} ${isActive ? styles.active : ''}`}>
      <div className={styles.timeColumn}>
        <span className={styles.timeRange}>{timeRange}</span>
      </div>

      <div className={styles.body}>
        <p className={styles.subject}>{subjectName}</p>
        {resolvedMeta && <p className={styles.meta}>{resolvedMeta}</p>}
      </div>

      {room && <div className={styles.room}>{room}</div>}
    </article>
  );
}
