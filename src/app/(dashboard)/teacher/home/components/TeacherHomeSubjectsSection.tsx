import Link from 'next/link';
import { Typography } from '@mui/material';
import { SubjectCard } from '@/components/shared/SubjectCard/SubjectCard';
import styles from '../home.module.scss';
import type { TeacherHomeSubject } from './TeacherHome.types';

interface TeacherHomeSubjectsSectionProps {
  subjects: TeacherHomeSubject[];
  isLoading?: boolean;
  hasError?: boolean;
}

export function TeacherHomeSubjectsSection({
  subjects,
  isLoading = false,
  hasError = false,
}: TeacherHomeSubjectsSectionProps) {
  return (
    <section className={styles.subjectSection}>
      <div className={styles.sectionHeader}>
        <Typography className={styles.sectionTitle}>Мои предметы</Typography>
        <Link href="/teacher/subjects" className={styles.sectionLink}>
          Все предметы
        </Link>
      </div>

      {isLoading ? (
        <div className={styles.sectionState}>Загружаем предметы...</div>
      ) : hasError ? (
        <div className={styles.sectionState}>Не удалось загрузить предметы преподавателя.</div>
      ) : subjects.length === 0 ? (
        <div className={styles.sectionState}>У вас пока нет назначенных предметов.</div>
      ) : (
        <div className={styles.subjectsGrid}>
          {subjects.map((subject) => (
            <SubjectCard
              key={subject.id}
              {...subject}
              href="/teacher/subjects"
            />
          ))}
        </div>
      )}
    </section>
  );
}
