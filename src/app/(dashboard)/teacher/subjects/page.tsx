'use client';

import Link from 'next/link';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import { PageHero } from '@/components/ui';
import { useMyTeacherSubjects } from '@/lib/hooks/useSubjects';
import { pluralizeRu } from '@/lib/utils/pluralize';
import { buildTeacherSubjectCardViewModels } from '@/lib/utils/subjectView';
import styles from './subjects.module.scss';

export default function TeacherSubjectsPage() {
  const {
    data: teacherSubjects = [],
    isLoading,
    error,
  } = useMyTeacherSubjects();
  const subjectCards = buildTeacherSubjectCardViewModels(teacherSubjects);

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <PageHero
          className={styles.subjectsHero}
          title="Мои предметы"
          subtitle={isLoading ? 'Загружаем список предметов...' : `${teacherSubjects.length} ${pluralizeRu(teacherSubjects.length, ['предмет', 'предмета', 'предметов'])}`}
        />

        {isLoading ? (
          <section className={styles.stateCard}>Загружаем предметы преподавателя...</section>
        ) : error ? (
          <section className={styles.stateCard}>Не удалось загрузить предметы преподавателя.</section>
        ) : teacherSubjects.length === 0 ? (
          <section className={styles.stateCard}>У вас пока нет назначенных предметов.</section>
        ) : (
          <section className={styles.subjectsGrid} aria-label="Выбор группы по предмету">
            {subjectCards.map((subject) => {
              const SubjectIcon = subject.icon;

              return (
                <article key={subject.subjectId} className={styles.subjectCard}>
                  <div className={styles.cardTop}>
                    <div className={styles.iconBox}>
                      <SubjectIcon sx={{ fontSize: 42 }} />
                    </div>
                    <span className={styles.semesterBadge}>{subject.groupCountLabel}</span>
                  </div>

                  <div className={styles.subjectInfo}>
                    <h2>{subject.subjectName}</h2>
                    <div className={styles.groupsLine}>
                      <Groups2OutlinedIcon sx={{ fontSize: 22 }} />
                      <span>{subject.groupsLabel}: {subject.groupsSummary}</span>
                    </div>
                  </div>

                  <div className={styles.divider} />

                  <div className={styles.groupLinks}>
                    {subject.hasGroups ? (
                      subject.groups.map((group) => (
                        <Link
                          key={group.groupId}
                          href={group.href}
                          className={styles.groupLink}
                        >
                          {group.groupName}
                          <ChevronRightRoundedIcon sx={{ fontSize: 36 }} />
                        </Link>
                      ))
                    ) : (
                      <div className={styles.emptyGroups}>Для этого предмета пока нет доступных групп.</div>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
