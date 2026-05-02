import { cn } from '@/lib/utils/cn';
import styles from './EmptyDayState.module.scss';

interface EmptyDayStateProps {
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'compact';
  className?: string;
}

export function EmptyDayState({
  title = 'Пар нет',
  subtitle = 'Свободный от занятий день',
  variant = 'default',
  className,
}: EmptyDayStateProps) {
  if (variant === 'compact') {
    return (
      <div className={cn(styles.root, styles.compact, className)}>
        <span className={styles.compactTitle}>{title}</span>
      </div>
    );
  }

  return (
    <div className={cn(styles.root, className)}>
      <p className={styles.title}>{title}</p>
      {subtitle ? <span className={styles.subtitle}>{subtitle}</span> : null}
    </div>
  );
}
