import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import styles from './lesson.module.scss';

const LESSONS = [
  {
    id: 1,
    type: 'Лекция',
    title: 'Введение в математический анализ',
    date: '03.04.2024',
    time: '09:00 — 10:30',
    room: 'Ауд. 302',
    groups: '09-351, 09-352',
    status: 'Проведено',
  },
  {
    id: 2,
    type: 'Практика',
    title: 'Пределы и непрерывность функций',
    date: '10.04.2024',
    time: '10:40 — 12:10',
    room: 'Ауд. 414',
    groups: '09-352',
    status: 'Проведено',
  },
  {
    id: 3,
    type: 'Контрольная',
    title: 'Производные и правила дифференцирования',
    date: '17.04.2024',
    time: '09:00 — 10:30',
    room: 'Ауд. 302',
    groups: '09-351, 09-352',
    status: 'Запланировано',
  },
];

const MATERIALS = [
  'Конспект лекции',
  'Задания для практики',
  'Критерии оценивания',
];

export default function TeacherLessonPage() {
  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>Мои предметы</h1>
            <p className={styles.metaLine}>3 семестр</p>
          </div>
        </header>

        <section className={styles.heroCard}>
          <div>
            <span className={styles.kicker}>Математический анализ</span>
            <h2>Занятия по предмету</h2>
            <p>Моковая страница для просмотра разных типов занятий, групп и учебных материалов.</p>
          </div>

          <div className={styles.heroStats}>
            <div>
              <strong>3</strong>
              <span>занятия</span>
            </div>
            <div>
              <strong>48</strong>
              <span>студентов</span>
            </div>
          </div>
        </section>

        <section className={styles.lessonsGrid} aria-label="Список занятий">
          {LESSONS.map((lesson) => (
            <article key={lesson.id} className={styles.lessonCard}>
              <div className={styles.cardHeader}>
                <span className={styles.lessonType}>{lesson.type}</span>
                <span className={styles.status}>{lesson.status}</span>
              </div>

              <h2>{lesson.title}</h2>

              <div className={styles.lessonMeta}>
                <span>
                  <CalendarMonthOutlinedIcon sx={{ fontSize: 23 }} />
                  {lesson.date} • {lesson.time}
                </span>
                <span>
                  <LocationOnOutlinedIcon sx={{ fontSize: 23 }} />
                  {lesson.room}
                </span>
                <span>
                  <Groups2OutlinedIcon sx={{ fontSize: 23 }} />
                  {lesson.groups}
                </span>
              </div>
            </article>
          ))}
        </section>

        <section className={styles.bottomGrid}>
          <article className={styles.panel}>
            <div className={styles.panelIcon}>
              <MenuBookOutlinedIcon sx={{ fontSize: 34 }} />
            </div>
            <div>
              <h2>Материалы</h2>
              <ul>
                {MATERIALS.map((material) => (
                  <li key={material}>{material}</li>
                ))}
              </ul>
            </div>
          </article>

          <article className={styles.panel}>
            <div className={styles.panelIcon}>
              <TaskAltRoundedIcon sx={{ fontSize: 34 }} />
            </div>
            <div>
              <h2>Следующая задача</h2>
              <p>Подготовить ведомость посещаемости и отправить баллы группе 09-352.</p>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
