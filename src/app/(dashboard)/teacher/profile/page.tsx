'use client';

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { useAuth } from '@/lib/hooks/useAuth';
import { PageHero, FieldItem, LogoutButton } from '@/components/ui';
import styles from './profile.module.scss';

const TEACHER_PROFILE = {
  fullName: 'Закиров Тимур Салаватович',
  role: 'Преподаватель',
  email: 't.zakirov@kpfu.ru',
};

export default function TeacherProfilePage() {
  const { logout } = useAuth();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero title="Профиль" subtitle="Личные и профессиональные данные" />

        <div className={styles.content}>
          <aside className={styles.profileCard}>
            <div className={styles.avatarBox}>
              <AccountCircleOutlinedIcon sx={{ fontSize: 48 }} />
            </div>
            <h2 className={styles.profileName}>{TEACHER_PROFILE.fullName}</h2>
            <span className={styles.roleBadge}>{TEACHER_PROFILE.role}</span>

            <div className={styles.cardDivider} />

            <div className={styles.profileFacts}>
              <FieldItem label="Почта" value={TEACHER_PROFILE.email} />
            </div>
          </aside>
        </div>

        <div className={styles.actions}>
          <LogoutButton onClick={() => logout()} />
        </div>
      </div>
    </div>
  );
}
