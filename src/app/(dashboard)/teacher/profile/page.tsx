'use client';

import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/stores/useAuthStore';
import { PageHero, FieldItem, LogoutButton } from '@/components/ui';
import styles from './profile.module.scss';

const ROLE_LABEL = 'Преподаватель';

function buildFullName(lastName?: string, firstName?: string, patronymic?: string) {
  return [lastName, firstName, patronymic].filter(Boolean).join(' ').trim();
}

export default function TeacherProfilePage() {
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const fullName = buildFullName(user?.lastName, user?.firstName, user?.patronymic) || '—';
  const email = user?.email ?? '';

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero title="Профиль" subtitle="Личные данные" />

        <article className={styles.profileCard}>
          <div className={styles.identity}>
            <h2 className={styles.profileName}>{fullName}</h2>
            <span className={styles.roleBadge}>{ROLE_LABEL}</span>
          </div>

          <div className={styles.cardDivider} />

          <div className={styles.contactRow}>
            <span className={styles.contactIcon} aria-hidden="true">
              <MailOutlineRoundedIcon sx={{ fontSize: 22 }} />
            </span>
            <FieldItem label="Рабочая почта" value={email} />
          </div>
        </article>

        <div className={styles.actions}>
          <LogoutButton onClick={() => logout()} />
        </div>
      </div>
    </div>
  );
}
