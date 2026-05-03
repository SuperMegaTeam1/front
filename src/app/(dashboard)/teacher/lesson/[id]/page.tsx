'use client';

import { useState } from 'react';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { PageHero } from '@/components/ui';
import styles from './lesson.module.scss';

interface Student {
  id: number;
  fullName: string;
}

interface Group {
  id: string;
  name: string;
  students: Student[];
}

const LESSON = {
  subject: 'Математический анализ',
  type: 'Лекция',
  date: '03.04.2026',
  startTime: '08:30',
  endTime: '10:00',
};

const GROUPS: Group[] = [
  {
    id: '09-351',
    name: '09-351',
    students: [
      { id: 1, fullName: 'Иванова Мария Алексеевна' },
      { id: 2, fullName: 'Кузнецов Денис Андреевич' },
      { id: 3, fullName: 'Лебедев Кирилл Львович' },
      { id: 4, fullName: 'Морозова Софья Геннадьевна' },
      { id: 5, fullName: 'Николаев Павел Романович' },
      { id: 6, fullName: 'Орлова Виктория Юрьевна' },
    ],
  },
  {
    id: '09-352',
    name: '09-352',
    students: [
      { id: 1, fullName: 'Александров Артем Игоревич' },
      { id: 2, fullName: 'Белов Максим Сергеевич' },
      { id: 3, fullName: 'Васильева Елена Дмитриевна' },
      { id: 4, fullName: 'Громов Иван Павлович' },
      { id: 5, fullName: 'Дмитриев Олег Борисович' },
      { id: 6, fullName: 'Егорова Анна Викторовна' },
    ],
  },
];

function formatShortFullName(fullName: string) {
  const [lastName, firstName, fatherName] = fullName.trim().split(/\s+/);

  if (!lastName || !firstName || !fatherName) {
    return fullName;
  }

  return `${lastName[0]}. ${firstName[0]}. ${fatherName}`;
}

function GroupGradebook({
  group,
  scores,
  onScoreChange,
}: {
  group: Group;
  scores: Record<number, string>;
  onScoreChange: (studentId: number, value: string) => void;
}) {
  return (
    <section className={styles.groupSection}>
      <header className={styles.groupHeader}>
        <h2 className={styles.groupTitle}>Группа {group.name}</h2>
        <span className={styles.studentsBadge}>{group.students.length} студентов</span>
      </header>

      <div className={styles.gradebookCard}>
        <div className={styles.tableHeader}>
          <span className={styles.numCol}>№</span>
          <span className={styles.nameCol}>ФИО СТУДЕНТА</span>
          <span className={styles.scoreCol}>БАЛЛЫ/Н</span>
        </div>

        <div className={styles.tableBody}>
          {group.students.map((student, index) => (
            <div key={student.id} className={styles.row}>
              <span className={styles.numCell}>{index + 1}</span>
              <span className={styles.nameCell}>{formatShortFullName(student.fullName)}</span>
              <input
                type="text"
                className={styles.scoreInput}
                placeholder="—"
                value={scores[student.id] ?? ''}
                onChange={(event) => onScoreChange(student.id, event.target.value)}
                aria-label={`Балл для ${student.fullName}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function TeacherLessonPage() {
  const [scoresByGroup, setScoresByGroup] = useState<Record<string, Record<number, string>>>({});

  const handleScoreChange = (groupId: string, studentId: number, value: string) => {
    setScoresByGroup((prev) => ({
      ...prev,
      [groupId]: { ...(prev[groupId] ?? {}), [studentId]: value },
    }));
  };

  const handleSubmit = () => {
    // TODO: отправка баллов
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero
          title={`${LESSON.subject} — ${LESSON.type}`}
          meta={
            <>
              <CalendarTodayOutlinedIcon sx={{ fontSize: 14 }} />
              <span>{LESSON.date} · {LESSON.startTime} – {LESSON.endTime}</span>
            </>
          }
        />

        {GROUPS.map((group) => (
          <GroupGradebook
            key={group.id}
            group={group}
            scores={scoresByGroup[group.id] ?? {}}
            onScoreChange={(studentId, value) => handleScoreChange(group.id, studentId, value)}
          />
        ))}

        <div className={styles.actions}>
          <button type="button" className={styles.submitButton} onClick={handleSubmit}>
            <SendRoundedIcon sx={{ fontSize: 18 }} />
            Отправить баллы
          </button>
        </div>
      </div>
    </div>
  );
}
