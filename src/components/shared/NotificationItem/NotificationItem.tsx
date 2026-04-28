import type { ReactNode } from 'react';
import styles from './NotificationItem.module.scss';

interface NotificationItemProps {
  title: string;
  message: string;
  time: string;
  icon: ReactNode;
}

export function NotificationItem({
  title,
  message,
  time,
  icon,
}: NotificationItemProps) {
  return (
    <article className={styles.root}>
      <div className={styles.iconWrap}>{icon}</div>

      <div className={styles.body}>
        <div className={styles.headerRow}>
          <p className={styles.title}>{title}</p>
          <time className={styles.time}>{time}</time>
        </div>
        <p className={styles.message}>{message}</p>
      </div>
    </article>
  );
}
