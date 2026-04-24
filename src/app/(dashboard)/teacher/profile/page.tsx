'use client';

import Link from 'next/link';
import { Avatar, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import { useAuthStore } from '@/stores/useAuthStore';
import type { Teacher } from '@/types/user';
import styles from './profile.module.scss';

const FALLBACK_TEACHER: Teacher = {
  id: 1,
  login: 'dmitriev.da',
  firstName: 'Дмитрий',
  lastName: 'Иванов',
  patronymic: 'Александрович',
  phone: '+7 (917) 555-18-27',
  role: 'teacher',
  subjectIds: [1, 2, 3, 4],
};

const SUBJECTS = [
  { name: 'Базы данных', details: 'Лекции и практики для 09-351, 09-352' },
  { name: 'Дискретная математика', details: 'Практические занятия для 09-234, 09-251' },
  { name: 'Программная инженерия', details: 'Лабораторные для 08-222, 09-351' },
];

const WEEK_SCHEDULE = [
  { label: 'Сегодня', value: '3 пары' },
  { label: 'На этой неделе', value: '12 занятий' },
  { label: 'Приём студентов', value: 'Чт 15:00-17:00' },
];

export default function TeacherProfilePage() {
  const { user } = useAuthStore();
  const teacher = user?.role === 'teacher' ? (user as Teacher) : FALLBACK_TEACHER;
  const subjectIds = Array.isArray(teacher.subjectIds) ? teacher.subjectIds : FALLBACK_TEACHER.subjectIds;

  const fullName = [teacher.lastName, teacher.firstName, teacher.patronymic]
    .filter(Boolean)
    .join(' ');
  const shortName = [teacher.firstName, teacher.patronymic].filter(Boolean).join(' ');
  const initials = `${teacher.firstName[0] ?? ''}${teacher.lastName[0] ?? ''}`.trim() || 'МИ';
  const email = teacher.login ? `${teacher.login}@kpfu.ru` : 'ivmiit@kpfu.ru';
  const subjectsCount = subjectIds.length || SUBJECTS.length;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroBody}>
            <span className={styles.eyebrow}>ПРОФИЛЬ ПРЕПОДАВАТЕЛЯ</span>
            <Typography className={styles.title}>{fullName}</Typography>
            <Typography className={styles.subtitle}>
              Личный кабинет преподавателя ИВМиИТ с актуальной учебной нагрузкой,
              контактами и быстрым доступом к основным рабочим разделам.
            </Typography>

            <div className={styles.heroMeta}>
              <span>ИВМиИТ КФУ</span>
              <span className={styles.metaDot}>·</span>
              <span>{subjectsCount} дисциплины</span>
              <span className={styles.metaDot}>·</span>
              <span>Очный формат</span>
            </div>

            <Link href="/teacher/schedule" className={styles.primaryLink}>
              Перейти в расписание <ArrowForwardIcon sx={{ fontSize: 24 }} />
            </Link>
          </div>

          <aside className={styles.profileCard}>
            <div className={styles.profileHead}>
              <Avatar
                variant="rounded"
                className={styles.avatar}
                sx={{
                  bgcolor: '#2a657e',
                  width: 88,
                  height: 88,
                  borderRadius: '24px',
                  fontSize: '30px',
                  fontWeight: 800,
                }}
              >
                {initials}
              </Avatar>

              <div className={styles.profileHeadText}>
                <p className={styles.profileName}>{shortName}</p>
                <p className={styles.profileRole}>Преподаватель</p>
              </div>
            </div>

            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <BadgeOutlinedIcon sx={{ fontSize: 24 }} />
                <span>{teacher.login}</span>
              </div>
              <div className={styles.contactItem}>
                <MailOutlineRoundedIcon sx={{ fontSize: 24 }} />
                <span>{email}</span>
              </div>
              <div className={styles.contactItem}>
                <LocalPhoneOutlinedIcon sx={{ fontSize: 24 }} />
                <span>{teacher.phone || '+7 (843) 233-71-09'}</span>
              </div>
            </div>
          </aside>
        </section>

        <section className={styles.statsGrid}>
          <article className={styles.statCard}>
            <div className={styles.statIcon}>
              <MenuBookOutlinedIcon sx={{ fontSize: 32 }} />
            </div>
            <div>
              <p className={styles.statValue}>{subjectsCount}</p>
              <p className={styles.statLabel}>Активные дисциплины</p>
            </div>
          </article>

          <article className={styles.statCard}>
            <div className={styles.statIcon}>
              <Groups2OutlinedIcon sx={{ fontSize: 32 }} />
            </div>
            <div>
              <p className={styles.statValue}>6</p>
              <p className={styles.statLabel}>Учебные группы</p>
            </div>
          </article>

          <article className={styles.statCard}>
            <div className={styles.statIcon}>
              <CalendarMonthOutlinedIcon sx={{ fontSize: 32 }} />
            </div>
            <div>
              <p className={styles.statValue}>12</p>
              <p className={styles.statLabel}>Занятий на неделе</p>
            </div>
          </article>
        </section>

        <section className={styles.contentGrid}>
          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <Typography className={styles.panelTitle}>Основная информация</Typography>
              <span className={styles.panelPill}>Профиль</span>
            </div>

            <div className={styles.infoRows}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>ФИО</span>
                <span className={styles.infoValue}>{fullName}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Роль</span>
                <span className={styles.infoValue}>Преподаватель</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Подразделение</span>
                <span className={styles.infoValue}>Институт вычислительной математики и информационных технологий</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Логин</span>
                <span className={styles.infoValue}>{teacher.login}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Телефон</span>
                <span className={styles.infoValue}>{teacher.phone || '+7 (843) 233-71-09'}</span>
              </div>
            </div>
          </article>

          <article className={styles.panel}>
            <div className={styles.panelHeader}>
              <Typography className={styles.panelTitle}>Учебная нагрузка</Typography>
              <span className={styles.panelPill}>Текущий семестр</span>
            </div>

            <div className={styles.subjectList}>
              {SUBJECTS.map((subject) => (
                <div key={subject.name} className={styles.subjectItem}>
                  <div className={styles.subjectIcon}>
                    <SchoolOutlinedIcon sx={{ fontSize: 24 }} />
                  </div>
                  <div className={styles.subjectBody}>
                    <p className={styles.subjectName}>{subject.name}</p>
                    <p className={styles.subjectDetails}>{subject.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <Typography className={styles.panelTitle}>Рабочий ритм</Typography>
            <span className={styles.panelPill}>Неделя 10</span>
          </div>

          <div className={styles.scheduleGrid}>
            {WEEK_SCHEDULE.map((item) => (
              <div key={item.label} className={styles.scheduleCard}>
                <div className={styles.scheduleIcon}>
                  <AccessTimeOutlinedIcon sx={{ fontSize: 26 }} />
                </div>
                <div>
                  <p className={styles.scheduleLabel}>{item.label}</p>
                  <p className={styles.scheduleValue}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
