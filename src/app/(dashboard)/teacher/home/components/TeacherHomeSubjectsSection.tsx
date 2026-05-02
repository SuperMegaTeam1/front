import Link from 'next/link';
import { Typography } from '@mui/material';
import { SubjectCard } from '@/components/shared/SubjectCard/SubjectCard';
import styles from '../home.module.scss';
import type { TeacherHomeSubject } from './TeacherHome.types';

interface TeacherHomeSubjectsSectionProps {
  subjects: TeacherHomeSubject[];
}

export function TeacherHomeSubjectsSection({
  subjects,
}: TeacherHomeSubjectsSectionProps) {
  return (
    <section className={styles.subjectSection}>
      <div className={styles.sectionHeader}>
        <Typography className={styles.sectionTitle}>Мои предметы</Typography>
        <Link href="/teacher/subjects" className={styles.sectionLink}>
          Все предметы
        </Link>
      </div>

      <div className={styles.subjectsGrid}>
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.id}
            {...subject}
            href="/teacher/subjects"
          />
        ))}
      </div>
    </section>
  );
}
