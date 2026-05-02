import Link from 'next/link';
import { PageHero } from '@/components/ui';
import CalculateOutlinedIcon from '@mui/icons-material/CalculateOutlined';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import CodeOutlinedIcon from '@mui/icons-material/CodeOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import styles from './subjects.module.scss';

interface SubjectGroup {
  id: string;
  name: string;
}

interface TeacherSubject {
  id: string;
  title: string;
  semester: string;
  groupsSummary: string;
  studentsCount: number;
  averageScore: string;
  icon: 'math' | 'discrete' | 'programming';
  groups: SubjectGroup[];
}

const SUBJECTS: TeacherSubject[] = [
  {
    id: 'mathematical-analysis',
    title: 'Математический анализ',
    semester: 'Семестр 4',
    groupsSummary: '09-351, 09-352',
    studentsCount: 48,
    averageScore: '4.2',
    icon: 'math',
    groups: [
      { id: '09-351', name: 'Группа 09-351' },
      { id: '09-352', name: 'Группа 09-352' },
    ],
  },
  {
    id: 'discrete-math',
    title: 'Дискретная математика',
    semester: 'Семестр 4',
    groupsSummary: '09-351',
    studentsCount: 24,
    averageScore: '3.9',
    icon: 'discrete',
    groups: [
      { id: '09-351', name: 'Группа 09-351' },
    ],
  },
  {
    id: 'software-engineering',
    title: 'Программная инженерия',
    semester: 'Семестр 4',
    groupsSummary: '09-351, 09-352, 09-353',
    studentsCount: 72,
    averageScore: '4.5',
    icon: 'programming',
    groups: [
      { id: '09-351', name: 'Группа 09-351' },
      { id: '09-352', name: 'Группа 09-352' },
      { id: '09-353', name: 'Группа 09-353' },
    ],
  },
];

const subjectIcons = {
  math: <CalculateOutlinedIcon sx={{ fontSize: 42 }} />,
  discrete: <HubOutlinedIcon sx={{ fontSize: 42 }} />,
  programming: <CodeOutlinedIcon sx={{ fontSize: 42 }} />,
};

export default function TeacherSubjectsPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <PageHero className={styles.subjectsHero} title="Мои предметы" subtitle="4 семестр" />

        <section className={styles.subjectsGrid} aria-label="Выбор группы по предмету">
          {SUBJECTS.map((subject) => (
            <article key={subject.id} className={styles.subjectCard}>
              <div className={styles.cardTop}>
                <div className={styles.iconBox}>
                  {subjectIcons[subject.icon]}
                </div>
                <span className={styles.semesterBadge}>{subject.semester}</span>
              </div>

              <div className={styles.subjectInfo}>
                <h2>{subject.title}</h2>
                <div className={styles.groupsLine}>
                  <Groups2OutlinedIcon sx={{ fontSize: 22 }} />
                  <span>{subject.groupsSummary}</span>
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.statsRow}>
                <div>
                  <span>Студентов</span>
                  <strong>{subject.studentsCount}</strong>
                </div>
                <div>
                  <span>Средний балл</span>
                  <strong className={styles.averageScore}>{subject.averageScore}</strong>
                </div>
              </div>

              <div className={styles.groupLinks}>
                {subject.groups.map((group) => (
                  <Link
                    key={group.id}
                    href={`/teacher/subjects/${subject.id}/${group.id}`}
                    className={styles.groupLink}
                  >
                    {group.name}
                    <ChevronRightRoundedIcon sx={{ fontSize: 36 }} />
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
