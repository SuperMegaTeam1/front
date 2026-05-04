import type { ReactNode } from 'react';
import styles from './InfoCard.module.scss';

interface InfoCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  variant?: 'default' | 'white';
}

export function InfoCard({ title, icon, children, variant = 'default' }: InfoCardProps) {
  return (
    <section className={`${styles.root} ${variant === 'white' ? styles.white : ''}`}>
      <header className={styles.header}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <h2 className={styles.title}>{title}</h2>
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
