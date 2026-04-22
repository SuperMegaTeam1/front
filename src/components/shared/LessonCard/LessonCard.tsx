import styles from './LessonCard.module.scss';

interface LessonCardProps {
  timeStart: string;
  timeEnd: string;
  subject: string;
  type: string;
  groups: string;
  room: string;
  dimmed?: boolean;
  compact?: boolean;
}

export function LessonCard({
  timeStart,
  timeEnd,
  subject,
  type,
  groups,
  room,
  dimmed = false,
  compact = false,
}: LessonCardProps) {
  return (
    <div className={`${styles.root} ${dimmed ? styles.dimmed : ''} ${compact ? styles.compact : ''}`}>
      <div className={styles.info}>
        <span className={styles.time}>{timeStart} — {timeEnd}</span>
        <div className={styles.subject}>
          <span className={styles.name}>{subject}</span>
          {!compact && <span className={styles.meta}>{type} • {groups}</span>}
        </div>
      </div>
      {!compact && <span className={styles.room}>{room}</span>}
    </div>
  );
}
