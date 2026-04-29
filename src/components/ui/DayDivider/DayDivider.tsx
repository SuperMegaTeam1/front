import styles from './DayDivider.module.scss';

interface DayDividerProps {
  label: string;
}

export function DayDivider({ label }: DayDividerProps) {
  return (
    <div className={styles.root}>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
