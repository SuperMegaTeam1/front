'use client';

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import styles from './profile.module.scss';

const TEACHER_PROFILE = {
  fullName: 'Закиров Тимур Салаватович',
  role: 'Преподаватель',
  degree: 'Кандидат технических наук',
  position: 'Доцент кафедры программной инженерии',
  startedAt: '2018 года',
  education: 'ИВМиИТ КФУ (выпуск 2015)',
  disciplines:
    'Архитектура информационных систем, Разработка мобильных приложений, Объектно-ориентированное программирование',
  email: 't.zakirov@kpfu.ru',
  office: 'ул. Кремлевская, 35, ауд. 1008',
  phone: '+7 (843) 233-71-09',
};

export default function TeacherProfilePage() {
  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <h1>Профиль</h1>
          <p>Личные и профессиональные данные</p>
        </header>

        <section className={styles.content} aria-label="Профиль преподавателя">
          <aside className={styles.profileCard}>
            <div className={styles.avatarBox}>
              <AccountCircleOutlinedIcon sx={{ fontSize: 32 }} />
            </div>

            <h2>{TEACHER_PROFILE.fullName}</h2>
            <span className={styles.roleBadge}>{TEACHER_PROFILE.role}</span>

            <div className={styles.cardDivider} />

            <div className={styles.profileFacts}>
              <div>
                <span>Ученая степень</span>
                <strong>{TEACHER_PROFILE.degree}</strong>
              </div>
              <div>
                <span>Должность</span>
                <strong>{TEACHER_PROFILE.position}</strong>
              </div>
            </div>
          </aside>

          <div className={styles.detailsColumn}>
            <article className={styles.infoCard}>
              <h2>
                <SchoolOutlinedIcon sx={{ fontSize: 22 }} />
                Информация о преподавателе
              </h2>

              <div className={styles.infoGrid}>
                <div className={styles.infoField}>
                  <span>В университете с</span>
                  <strong>{TEACHER_PROFILE.startedAt}</strong>
                </div>
                <div className={styles.infoField}>
                  <span>Образование</span>
                  <strong>{TEACHER_PROFILE.education}</strong>
                </div>
                <div className={`${styles.infoField} ${styles.infoFieldWide}`}>
                  <span>Преподаваемые дисциплины</span>
                  <strong>{TEACHER_PROFILE.disciplines}</strong>
                </div>
              </div>
            </article>

            <article className={styles.contactsCard}>
              <h2>Контактные данные</h2>

              <div className={styles.contactsGrid}>
                <div className={styles.contactField}>
                  <span>Рабочая почта</span>
                  <strong>{TEACHER_PROFILE.email}</strong>
                </div>
                <div className={styles.contactField}>
                  <span>Кабинет</span>
                  <strong>{TEACHER_PROFILE.office}</strong>
                </div>
                <div className={`${styles.contactField} ${styles.contactFieldWide}`}>
                  <span>Телефон (раб.)</span>
                  <strong>{TEACHER_PROFILE.phone}</strong>
                </div>
              </div>
            </article>
          </div>
        </section>

        <div className={styles.actions}>
          <button type="button" className={styles.logoutButton}>
            <LogoutRoundedIcon sx={{ fontSize: 15 }} />
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </main>
  );
}
