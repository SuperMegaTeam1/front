import type { ReactNode } from 'react';
import { Typography } from '@mui/material';
import styles from '../home.module.scss';

interface StudentHomeNotification {
  id: number;
  icon: ReactNode;
  title: string;
  subtitle: string;
  time: string;
}

interface StudentHomeRecentChangesSectionProps {
  notifications: StudentHomeNotification[];
}

export function StudentHomeRecentChangesSection({
  notifications,
}: StudentHomeRecentChangesSectionProps) {
  return (
    <section className={styles.changesSection}>
      <Typography className={styles.sectionTitle}>Последние изменения</Typography>

      <div className={styles.changesCard}>
        {notifications.map((notification, index) => (
          <article
            key={notification.id}
            className={`${styles.changeItem} ${index < notifications.length - 1 ? styles.changeItemBorder : ''}`}
          >
            <div className={styles.changeIcon}>{notification.icon}</div>
            <div className={styles.changeBody}>
              <p className={styles.changeTitle}>{notification.title}</p>
              <p className={styles.changeSubtitle}>{notification.subtitle}</p>
            </div>
            <span className={styles.changeTime}>{notification.time}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
