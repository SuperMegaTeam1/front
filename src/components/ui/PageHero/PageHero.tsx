'use client';

import type { ReactNode } from 'react';
import styles from './PageHero.module.scss';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  center?: ReactNode;
  meta?: ReactNode;
}

export function PageHero({ title, subtitle, action, center, meta }: PageHeroProps) {
  return (
    <section className={styles.root}>
      <div className={styles.inner}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {meta && <div className={styles.meta}>{meta}</div>}
      </div>
      {center && <div className={styles.center}>{center}</div>}
      {action && <div className={styles.action}>{action}</div>}
    </section>
  );
}
