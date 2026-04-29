import styles from './EmptyDayState.module.scss';

interface EmptyDayStateProps {
  title?: string;
  subtitle?: string;
}

export function EmptyDayState({
  title = 'Нет пар',
  subtitle = 'Свободный от занятий день',
}: EmptyDayStateProps) {
  return (
    <div className={styles.root}>
      <p className={styles.title}>{title}</p>
      <span className={styles.subtitle}>{subtitle}</span>
    </div>
  );
}
