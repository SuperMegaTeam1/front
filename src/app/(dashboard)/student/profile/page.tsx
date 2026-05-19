'use client';

import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import { useAuth } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/stores/useAuthStore';
import { PageHero, InfoCard, FieldItem, LogoutButton } from '@/components/ui';
import styles from './profile.module.scss';

// Корректный формат кода группы: две цифры, дефис, три цифры (например, 09-352).
// XX - код института, далее [Y][D][N], где Y — год поступления (одна цифра),
// D — внутренний номер направления, N — номер группы в направлении.
const GROUP_PATTERN = /^(\d{2})-(\d)(\d)(\d)$/;
const INVALID_GROUP_LABEL = 'Неверный формат группы';
const UNKNOWN_VALUE = '—';
const DEFAULT_STUDY_FORM = 'Очная форма';

// Институты/факультеты КФУ по первым двум цифрам кода группы.
// 04.1/04.2/04.3 имеют точку и не подходят под формат XX-XXX, поэтому здесь не учитываются.
const INSTITUTE_BY_CODE: Record<string, string> = {
  '01': 'Институт фундаментальной медицины и биологии',
  '02': 'Институт экологии, биотехнологии и природопользования',
  '03': 'Институт геологии и нефтегазовых технологий',
  '04': 'Институт международных отношений, истории и востоковедения',
  '05': 'Институт математики и механики им. Н. И. Лобачевского',
  '06': 'Институт физики',
  '07': 'Химический институт им. А. М. Бутлерова',
  '08': 'Юридический факультет',
  '09': 'ИВМИиТ',
};

// Внутренний номер направления → название. Расширяется вручную.
// Ключ верхнего уровня — код института.
const DIRECTION_BY_INSTITUTE: Record<string, Record<string, string>> = {
  '09': {
    '5': 'Прикладная информатика',
  },
};

function resolveAdmissionYear(yearDigit: number, today: Date): number {
  const currentYear = today.getFullYear();
  const decadeStart = Math.floor(currentYear / 10) * 10;
  const candidate = decadeStart + yearDigit;
  return candidate <= currentYear ? candidate : candidate - 10;
}

function resolveCourseAndSemester(yearDigit: number, today: Date) {
  const admissionYear = resolveAdmissionYear(yearDigit, today);
  const month = today.getMonth(); // 0..11
  // Учебный год начинается в сентябре (месяц 8).
  const academicYearStart = month >= 8 ? today.getFullYear() : today.getFullYear() - 1;
  const course = Math.max(1, academicYearStart - admissionYear + 1);
  // Осенний семестр: сент-янв (1, 3, 5, ...). Весенний: фев-авг (2, 4, 6, ...).
  const isAutumn = month >= 8 || month === 0;
  const semester = isAutumn ? course * 2 - 1 : course * 2;
  return { course, semester };
}

export default function StudentProfilePage() {
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const email = user?.email ?? '';
  const groupName = (user?.groupName ?? '').trim();
  const match = groupName.match(GROUP_PATTERN);

  const derived = match
    ? (() => {
        const [, instituteCode, yearDigitStr, directionDigitStr] = match;
        const yearDigit = Number(yearDigitStr);
        const { course, semester } = resolveCourseAndSemester(yearDigit, new Date());
        return {
          university: INSTITUTE_BY_CODE[instituteCode] ?? UNKNOWN_VALUE,
          direction:
            DIRECTION_BY_INSTITUTE[instituteCode]?.[directionDigitStr] ?? UNKNOWN_VALUE,
          course: `${course} курс`,
          semester: `${semester} семестр`,
          studyForm: DEFAULT_STUDY_FORM,
        };
      })()
    : {
        university: INVALID_GROUP_LABEL,
        direction: INVALID_GROUP_LABEL,
        course: INVALID_GROUP_LABEL,
        semester: INVALID_GROUP_LABEL,
        studyForm: INVALID_GROUP_LABEL,
      };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <PageHero title="Профиль" subtitle="Личные и учебные данные" />

        <InfoCard title="Учебная программа" icon={<SchoolOutlinedIcon sx={{ fontSize: 22 }} />}>
          <div className={styles.programGrid}>
            <FieldItem label="Группа" value={groupName} />
            <FieldItem label="Университет" value={derived.university} />
            <FieldItem label="Направление" value={derived.direction} />
            <FieldItem label="Курс" value={derived.course} />
            <FieldItem label="Семестр" value={derived.semester} />
            <FieldItem label="Форма обучения" value={derived.studyForm} />
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
