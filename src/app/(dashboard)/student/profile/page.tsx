'use client';

import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/stores/useAuthStore';
import { PageHero, InfoCard, FieldItem, LogoutButton } from '@/components/ui';
import { deriveStudentProgram } from '@/lib/utils/studentProgram';
import styles from './profile.module.scss';

export default function StudentProfilePage() {
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const email = user?.email ?? '';
  const groupName = (user?.groupName ?? '').trim();
  const program = deriveStudentProgram(groupName, new Date());

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero title="Профиль" subtitle="Личные и учебные данные" />

        <InfoCard title="Учебная программа" icon={<SchoolOutlinedIcon sx={{ fontSize: 22 }} />}>
          <div className={styles.programGrid}>
            <FieldItem label="Группа" value={groupName} />
            <FieldItem label="Университет" value={program.university} />
            <FieldItem label="Направление" value={program.direction} />
            <FieldItem label="Курс" value={program.course} />
            <FieldItem label="Семестр" value={program.semester} />
            <FieldItem label="Форма обучения" value={program.studyForm} />
          </div>
        </InfoCard>

        <InfoCard title="Контактные данные" icon={<ContactPhoneOutlinedIcon sx={{ fontSize: 22 }} />} variant="white">
          <div className={styles.contactGrid}>
            <FieldItem label="Университетская почта" value={email} />
          </div>
        </InfoCard>

        <div className={styles.actions}>
          <LogoutButton onClick={() => logout()} />
        </div>
      </div>
    </div>
  );
}
