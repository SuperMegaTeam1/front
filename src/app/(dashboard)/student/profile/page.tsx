'use client';

import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { Typography } from '@mui/material';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/stores/useAuthStore';
import styles from './profile.module.scss';

const PROGRAM_FIELDS = [
  { label: 'Группа', key: 'groupName', fallback: '09-411' },
  { label: 'Курс', key: 'course', fallback: '3 курс' },
  { label: 'Направление', key: 'direction', fallback: 'Программная инженерия' },
  { label: 'Семестр', key: 'semester', fallback: '6 семестр' },
  { label: 'Форма обучения', key: 'studyForm', fallback: 'Очная форма' },
];

export default function StudentProfilePage() {
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const profile = user as (typeof user & {
    groupName?: string;
    course?: string;
    direction?: string;
    semester?: string;
    studyForm?: string;
    email?: string;
  }) | null;

  const email = profile?.email ?? `${user?.login ?? 't.saf'}@stud.kpfu.ru`;
  const phone = user?.phone ?? '+7 900 123-45-67';

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <Typography component="h1" className={styles.title}>
              Профиль
            </Typography>
            <p className={styles.subtitle}>Личные и учебные данные</p>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.sectionIcon}>
              <SchoolOutlinedIcon sx={{ fontSize: 24 }} />
            </div>
            <Typography component="h2" className={styles.cardTitle}>
              Учебная программа
            </Typography>
          </div>

          <div className={styles.programGrid}>
            {PROGRAM_FIELDS.map((field) => (
              <div key={field.label} className={styles.field}>
                <p className={styles.fieldLabel}>{field.label}</p>
                <p className={styles.fieldValue}>
                  {profile?.[field.key] ?? field.fallback}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className={`${styles.card} ${styles.contactCard}`}>
          <Typography component="h2" className={styles.cardTitle}>
            Контактные данные
          </Typography>

          <div className={styles.contactGrid}>
            <div className={styles.contactField}>
              <p className={styles.fieldLabel}>Университетская почта</p>
              <p className={styles.contactValue}>{email}</p>
            </div>

            <div className={styles.contactField}>
              <p className={styles.fieldLabel}>Телефон</p>
              <p className={styles.contactValue}>{phone}</p>
            </div>
          </div>
        </section>

        <div className={styles.actions}>
          <button type="button" className={styles.logoutButton} onClick={() => logout()}>
            <LogoutRoundedIcon sx={{ fontSize: 18 }} />
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
}
