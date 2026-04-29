'use client';

import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/stores/useAuthStore';
import { PageHero, InfoCard, FieldItem, LogoutButton } from '@/components/ui';
import styles from './profile.module.scss';

type StudentProfileDetails = {
  groupName?: string;
  course?: string;
  direction?: string;
  semester?: string;
  studyForm?: string;
  email?: string;
};

const PROGRAM_FIELDS: Array<{ label: string; key: keyof StudentProfileDetails; fallback: string }> = [
  { label: 'Группа', key: 'groupName', fallback: '09-411' },
  { label: 'Курс', key: 'course', fallback: '3 курс' },
  { label: 'Направление', key: 'direction', fallback: 'Программная инженерия' },
  { label: 'Семестр', key: 'semester', fallback: '6 семестр' },
  { label: 'Форма обучения', key: 'studyForm', fallback: 'Очная форма' },
];

export default function StudentProfilePage() {
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const profile = user as (typeof user & StudentProfileDetails) | null;
  const email = profile?.email ?? `${user?.login ?? 't.saf'}@stud.kpfu.ru`;
  const phone = user?.phone ?? '+7 900 123-45-67';

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero title="Профиль" subtitle="Личные и учебные данные" />

        <InfoCard title="Учебная программа" icon={<SchoolOutlinedIcon sx={{ fontSize: 22 }} />}>
          <div className={styles.programGrid}>
            {PROGRAM_FIELDS.map((field) => (
              <FieldItem
                key={field.label}
                label={field.label}
                value={profile?.[field.key] ?? field.fallback}
              />
            ))}
          </div>
        </InfoCard>

        <InfoCard title="Контактные данные" icon={<ContactPhoneOutlinedIcon sx={{ fontSize: 22 }} />} variant="white">
          <div className={styles.contactGrid}>
            <FieldItem label="Университетская почта" value={email} />
            <FieldItem label="Телефон" value={phone} />
          </div>
        </InfoCard>

        <div className={styles.actions}>
          <LogoutButton onClick={() => logout()} />
        </div>
      </div>
    </div>
  );
}
