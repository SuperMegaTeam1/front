'use client';

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import { PageHero, InfoCard, FieldItem, LogoutButton } from '@/components/ui';
import styles from './profile.module.scss';

const TEACHER_PROFILE = {
  fullName: 'Закиров Тимур Салаватович',
  role: 'Преподаватель',
  degree: 'Кандидат технических наук',
  position: 'Доцент кафедры программной инженерии',
  startedAt: '2018 года',
  education: 'ИВМиИТ КФУ (выпуск 2015)',
  disciplines: 'Архитектура информационных систем, Разработка мобильных приложений, Объектно-ориентированное программирование',
  email: 't.zakirov@kpfu.ru',
  office: 'ул. Кремлевская, 35, ауд. 1008',
  phone: '+7 (843) 233-71-09',
};

export default function TeacherProfilePage() {
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
              <FieldItem label="Ученая степень" value={TEACHER_PROFILE.degree} />
              <FieldItem label="Должность" value={TEACHER_PROFILE.position} />
            </div>
          </aside>

          <div className={styles.detailsColumn}>
            <InfoCard title="Информация о преподавателе" icon={<SchoolOutlinedIcon sx={{ fontSize: 22 }} />}>
              <div className={styles.infoGrid}>
                <FieldItem label="В университете с" value={TEACHER_PROFILE.startedAt} />
                <FieldItem label="Образование" value={TEACHER_PROFILE.education} />
                <div className={styles.wide}>
                  <FieldItem label="Преподаваемые дисциплины" value={TEACHER_PROFILE.disciplines} />
                </div>
              </div>
            </InfoCard>

            <InfoCard title="Контактные данные" icon={<ContactPhoneOutlinedIcon sx={{ fontSize: 22 }} />} variant="white">
              <div className={styles.contactGrid}>
                <FieldItem label="Рабочая почта" value={TEACHER_PROFILE.email} />
                <FieldItem label="Кабинет" value={TEACHER_PROFILE.office} />
                <div className={styles.wide}>
                  <FieldItem label="Телефон (раб.)" value={TEACHER_PROFILE.phone} />
                </div>
              </div>
            </InfoCard>
          </div>
        </div>

        <div className={styles.actions}>
          <LogoutButton onClick={() => {}} />
        </div>
      </div>
    </div>
  );
}
