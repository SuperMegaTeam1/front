'use client';

import Link from 'next/link';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import type { SvgIconComponent } from '@mui/icons-material';
import { PageHero } from '@/components/ui';
import { useMyTeacherSubjects } from '@/lib/hooks/useSubjects';
import { pluralizeRu } from '@/lib/utils/pluralize';
import styles from './subjects.module.scss';

const SUBJECT_ICON_COMPONENTS: SvgIconComponent[] = [
  CalculateOutlinedIcon,
  HubOutlinedIcon,
  CodeOutlinedIcon,
];

function getGroupCountLabel(groupsCount: number) {
  return `${groupsCount} ${pluralizeRu(groupsCount, ['группа', 'группы', 'групп'])}`;
}

function getGroupsLineLabel(groupsCount: number) {
  return groupsCount === 1 ? 'Группа' : 'Группы';
}

export default function TeacherSubjectsPage() {
  const {
    data: teacherSubjects = [],
    isLoading,
    error,
  } = useMyTeacherSubjects();

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
            {teacherSubjects.map((subject, index) => {
              const groups = Array.isArray(subject.groups) ? subject.groups : [];
              const SubjectIcon = SUBJECT_ICON_COMPONENTS[index % SUBJECT_ICON_COMPONENTS.length];
              const groupsLabel = getGroupsLineLabel(groups.length);
              const groupsSummary = groups.length > 0
                ? groups.map((group) => group.groupName).join(', ')
                : 'пока не назначены';
              const hasGroups = groups.length > 0;

              return (
                <article key={subject.subjectId} className={styles.subjectCard}>
                  <div className={styles.cardTop}>
                    <div className={styles.iconBox}>
                      <SubjectIcon sx={{ fontSize: 42 }} />
                    </div>
                    <span className={styles.semesterBadge}>{getGroupCountLabel(groups.length)}</span>
                  </div>

                  <div className={styles.subjectInfo}>
                    <h2>{subject.subjectName}</h2>
                    <div className={styles.groupsLine}>
                      <Groups2OutlinedIcon sx={{ fontSize: 22 }} />
                      <span>{groupsLabel}: {groupsSummary}</span>
                    </div>
                  </div>

                  <div className={styles.divider} />

                  <div className={styles.groupLinks}>
                    {hasGroups ? (
                      groups.map((group) => (
                        <Link
                          key={group.groupId}
                          href={{
                            pathname: `/teacher/subjects/${subject.subjectId}/${group.groupId}`,
                            query: {
                              subjectName: subject.subjectName,
                              groupName: group.groupName,
                            },
                          }}
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
