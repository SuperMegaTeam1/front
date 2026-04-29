import styles from './FieldItem.module.scss';

interface FieldItemProps {
  label: string;
  value: string;
}

export function FieldItem({ label, value }: FieldItemProps) {
  return (
    <div className={styles.root}>
      <span className={styles.label}>{label}</span>
      <strong className={styles.value}>{value}</strong>
    </div>
  );
}
