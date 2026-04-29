'use client';

import { useMemo, useState } from 'react';
import { RatingTable, type RatingTableRow } from '@/components/shared/RatingTable/RatingTable';
import { useAuthStore } from '@/stores/useAuthStore';
import { PageHero } from '@/components/ui';
import type { Student } from '@/types/user';
import styles from './rating.module.scss';

type SubjectFilter = {
  id: string;
  label: string;
};

type StudentRatingRow = {
  id: number;
  studentName: string;
  avatarLabel: string;
  avatarColor: string;
  scores: Record<string, number>;
};

const SUBJECTS: SubjectFilter[] = [
  { id: 'all', label: 'Все предметы' },
  { id: 'databases', label: 'Базы данных' },
  { id: 'math-analysis', label: 'Математический анализ' },
  { id: 'history', label: 'История' },
  { id: 'architecture', label: 'Архитектура ЭВМ' },
  { id: 'economics', label: 'Экономика' },
];

const STUDENTS: StudentRatingRow[] = [
  { id: 1, studentName: 'Александра Волкова', avatarLabel: 'АВ', avatarColor: 'linear-gradient(135deg, #193f5c 0%, #2c8cad 100%)', scores: { all: 98.5, databases: 99.2, 'math-analysis': 97.8, history: 96.4, architecture: 99.1, economics: 99.8 } },
  { id: 2, studentName: 'Дмитрий Петров', avatarLabel: 'ДП', avatarColor: 'linear-gradient(135deg, #45b5c1 0%, #2e7f8b 100%)', scores: { all: 97.2, databases: 98.7, 'math-analysis': 95.6, history: 96.3, architecture: 97.5, economics: 97.7 } },
  { id: 3, studentName: 'Мария Иванова', avatarLabel: 'МИ', avatarColor: 'linear-gradient(135deg, #506786 0%, #1d3247 100%)', scores: { all: 95.8, databases: 96.1, 'math-analysis': 97.1, history: 94.4, architecture: 95.5, economics: 95.9 } },
  { id: 4, studentName: 'Иван Сергеев', avatarLabel: 'ИС', avatarColor: 'linear-gradient(135deg, #76b2c2 0%, #3d798b 100%)', scores: { all: 92.4, databases: 93.6, 'math-analysis': 91.3, history: 90.8, architecture: 93.2, economics: 93.1 } },
  { id: 5, studentName: 'Елена Кузнецова', avatarLabel: 'ЕК', avatarColor: 'linear-gradient(135deg, #69b2b7 0%, #2c7580 100%)', scores: { all: 91.9, databases: 93.1, 'math-analysis': 92.8, history: 88.7, architecture: 91.2, economics: 93.5 } },
  { id: 6, studentName: 'Артем Козлов', avatarLabel: 'АК', avatarColor: 'linear-gradient(135deg, #72bbcb 0%, #31788b 100%)', scores: { all: 90.5, databases: 90.9, 'math-analysis': 91.6, history: 89.3, architecture: 90.1, economics: 90.8 } },
  { id: 7, studentName: 'София Смирнова', avatarLabel: 'СС', avatarColor: 'linear-gradient(135deg, #234d64 0%, #3ca0c4 100%)', scores: { all: 89.7, databases: 91.8, 'math-analysis': 88.5, history: 87.9, architecture: 89.4, economics: 90.2 } },
  { id: 8, studentName: 'Никита Орлов', avatarLabel: 'НО', avatarColor: 'linear-gradient(135deg, #557689 0%, #274153 100%)', scores: { all: 88.9, databases: 89.5, 'math-analysis': 90.7, history: 85.2, architecture: 88.3, economics: 90.8 } },
  { id: 9, studentName: 'Полина Федорова', avatarLabel: 'ПФ', avatarColor: 'linear-gradient(135deg, #42b3c1 0%, #225d73 100%)', scores: { all: 87.8, databases: 88.2, 'math-analysis': 86.5, history: 87.3, architecture: 88.8, economics: 88.1 } },
  { id: 10, studentName: 'Глеб Морозов', avatarLabel: 'ГМ', avatarColor: 'linear-gradient(135deg, #7cc9cb 0%, #34747e 100%)', scores: { all: 87.1, databases: 86.7, 'math-analysis': 89.4, history: 84.9, architecture: 87.8, economics: 86.5 } },
  { id: 11, studentName: 'Анна Соколова', avatarLabel: 'АС', avatarColor: 'linear-gradient(135deg, #2d6278 0%, #5fb1d0 100%)', scores: { all: 86.6, databases: 87.4, 'math-analysis': 84.8, history: 86.2, architecture: 87.9, economics: 86.8 } },
  { id: 12, studentName: 'Роман Павлов', avatarLabel: 'РП', avatarColor: 'linear-gradient(135deg, #7092a4 0%, #32536a 100%)', scores: { all: 85.9, databases: 86.8, 'math-analysis': 84.2, history: 85.3, architecture: 86.0, economics: 87.2 } },
  { id: 13, studentName: 'Ксения Зайцева', avatarLabel: 'КЗ', avatarColor: 'linear-gradient(135deg, #59b9c9 0%, #236272 100%)', scores: { all: 85.2, databases: 84.9, 'math-analysis': 86.4, history: 83.7, architecture: 84.8, economics: 86.0 } },
  { id: 14, studentName: 'Максим Титов', avatarLabel: 'МТ', avatarColor: 'linear-gradient(135deg, #66818d 0%, #2f4957 100%)', scores: { all: 84.6, databases: 83.8, 'math-analysis': 86.1, history: 82.4, architecture: 85.3, economics: 84.7 } },
  { id: 15, studentName: 'Виктория Лебедева', avatarLabel: 'ВЛ', avatarColor: 'linear-gradient(135deg, #6ec0c9 0%, #417481 100%)', scores: { all: 83.9, databases: 84.7, 'math-analysis': 82.2, history: 83.4, architecture: 84.8, economics: 84.1 } },
  { id: 16, studentName: 'Егор Новиков', avatarLabel: 'ЕН', avatarColor: 'linear-gradient(135deg, #34576f 0%, #4ea6ca 100%)', scores: { all: 83.1, databases: 82.5, 'math-analysis': 84.6, history: 81.3, architecture: 83.9, economics: 83.2 } },
  { id: 17, studentName: 'Дарья Алексеева', avatarLabel: 'ДА', avatarColor: 'linear-gradient(135deg, #7db0c0 0%, #355f74 100%)', scores: { all: 82.4, databases: 81.8, 'math-analysis': 83.7, history: 81.4, architecture: 82.9, economics: 82.5 } },
  { id: 18, studentName: 'Кирилл Власов', avatarLabel: 'КВ', avatarColor: 'linear-gradient(135deg, #4cb4c0 0%, #1e6175 100%)', scores: { all: 81.6, databases: 82.7, 'math-analysis': 80.3, history: 79.8, architecture: 81.9, economics: 83.1 } },
  { id: 19, studentName: 'Алина Ермакова', avatarLabel: 'АЕ', avatarColor: 'linear-gradient(135deg, #59798d 0%, #304959 100%)', scores: { all: 80.8, databases: 80.1, 'math-analysis': 81.7, history: 79.4, architecture: 80.8, economics: 81.9 } },
  { id: 20, studentName: 'Тимур Грачев', avatarLabel: 'ТГ', avatarColor: 'linear-gradient(135deg, #71c1cb 0%, #316c79 100%)', scores: { all: 79.9, databases: 79.6, 'math-analysis': 80.7, history: 78.9, architecture: 80.3, economics: 80.2 } },
  { id: 21, studentName: 'Ольга Белова', avatarLabel: 'ОБ', avatarColor: 'linear-gradient(135deg, #2d6981 0%, #4ab2d1 100%)', scores: { all: 79.2, databases: 78.4, 'math-analysis': 80.2, history: 77.5, architecture: 79.4, economics: 80.6 } },
  { id: 22, studentName: 'Михаил Андреев', avatarLabel: 'МА', avatarColor: 'linear-gradient(135deg, #7891a3 0%, #3b5465 100%)', scores: { all: 78.4, databases: 78.9, 'math-analysis': 79.1, history: 76.8, architecture: 78.1, economics: 79.0 } },
  { id: 23, studentName: 'Яна Воробьева', avatarLabel: 'ЯВ', avatarColor: 'linear-gradient(135deg, #66b5c2 0%, #276073 100%)', scores: { all: 77.8, databases: 77.4, 'math-analysis': 78.8, history: 75.9, architecture: 78.1, economics: 78.6 } },
  { id: 24, studentName: 'Владислав Жуков', avatarLabel: 'ВЖ', avatarColor: 'linear-gradient(135deg, #58748c 0%, #294051 100%)', scores: { all: 77.1, databases: 76.9, 'math-analysis': 78.4, history: 74.8, architecture: 77.8, economics: 77.6 } },
  { id: 25, studentName: 'Лилия Комарова', avatarLabel: 'ЛК', avatarColor: 'linear-gradient(135deg, #5cb2bf 0%, #397080 100%)', scores: { all: 76.5, databases: 75.8, 'math-analysis': 77.4, history: 74.9, architecture: 76.3, economics: 77.2 } },
  { id: 26, studentName: 'Павел Николаев', avatarLabel: 'ПН', avatarColor: 'linear-gradient(135deg, #31576e 0%, #479ec3 100%)', scores: { all: 75.8, databases: 75.2, 'math-analysis': 76.9, history: 73.8, architecture: 75.5, economics: 76.7 } },
  { id: 27, studentName: 'Екатерина Романова', avatarLabel: 'ЕР', avatarColor: 'linear-gradient(135deg, #6eb7c5 0%, #2c6575 100%)', scores: { all: 75.2, databases: 74.7, 'math-analysis': 76.4, history: 73.1, architecture: 75.7, economics: 76.0 } },
  { id: 28, studentName: 'Сергей Фролов', avatarLabel: 'СФ', avatarColor: 'linear-gradient(135deg, #758c9c 0%, #334b59 100%)', scores: { all: 74.4, databases: 73.8, 'math-analysis': 75.2, history: 72.5, architecture: 74.8, economics: 75.3 } },
];

const INITIAL_VISIBLE_COUNT = 6;

export default function StudentRatingPage() {
  const { user } = useAuthStore();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const studentUser = user?.role === 'student' ? (user as Student) : null;
  const groupName = studentUser?.groupName ?? '09-352';

  const sortedRows = useMemo(() => {
    return [...STUDENTS]
      .sort((left, right) => right.scores[selectedSubject] - left.scores[selectedSubject])
      .map((student, index) => ({
        position: index + 1,
        studentName: student.studentName,
        score: student.scores[selectedSubject],
        avatarLabel: student.avatarLabel,
        avatarColor: student.avatarColor,
      }));
  }, [selectedSubject]);

  const visibleRows = useMemo<RatingTableRow[]>(
    () => sortedRows.slice(0, visibleCount),
    [sortedRows, visibleCount]
  );

  const averageScore = useMemo(() => {
    const total = sortedRows.reduce((accumulator, row) => accumulator + row.score, 0);
    return total / sortedRows.length;
  }, [sortedRows]);

  const handleSubjectChange = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero
          title={`Рейтинг группы ${groupName}`}
          subtitle="Академическая успеваемость за текущий семестр"
        />

        <section className={styles.overview}>
          <article className={styles.statCard}>
            <span className={styles.statLabel}>Средний балл</span>
            <span className={styles.statValue}>{averageScore.toFixed(1)}</span>
          </article>

          <article className={styles.statCard}>
            <span className={styles.statLabel}>Студентов</span>
            <span className={styles.statValue}>{sortedRows.length}</span>
          </article>

          <article className={styles.filterCard}>
            <span className={styles.filterTitle}>Фильтр по предметам</span>

            <div className={styles.filterList}>
              {SUBJECTS.map((subject) => (
                <button
                  key={subject.id}
                  type="button"
                  className={`${styles.filterButton} ${selectedSubject === subject.id ? styles.filterButtonActive : ''}`}
                  onClick={() => handleSubjectChange(subject.id)}
                >
                  {subject.label}
                </button>
              ))}
            </div>
          </article>
        </section>

        <RatingTable
          rows={visibleRows}
          visibleCount={visibleCount}
          totalCount={sortedRows.length}
          onShowMore={visibleCount < sortedRows.length ? () => setVisibleCount(sortedRows.length) : undefined}
        />
      </div>
    </div>
  );
}
