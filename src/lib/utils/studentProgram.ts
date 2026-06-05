/**
 * Разбор кода учебной группы (например, «09-352») в данные учебной программы.
 * Формат кода: XX-YDN, где XX — код института, Y — год поступления (одна цифра),
 * D — внутренний номер направления, N — номер группы.
 */

const GROUP_PATTERN = /^(\d{2})-(\d)(\d)(\d)$/;
const INVALID_GROUP_LABEL = 'Неверный формат группы';
const UNKNOWN_VALUE = '—';
const DEFAULT_STUDY_FORM = 'Очная форма';

// Институты/факультеты КФУ по первым двум цифрам кода группы.
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

// Внутренний номер направления → название. Ключ верхнего уровня — код института.
const DIRECTION_BY_INSTITUTE: Record<string, Record<string, string>> = {
  '09': {
    '5': 'Прикладная информатика',
  },
};

export interface StudentProgram {
  university: string;
  direction: string;
  course: string;
  semester: string;
  studyForm: string;
}

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

/** Вычисляет учебную программу из кода группы. При неверном формате — метки-заглушки. */
export function deriveStudentProgram(groupName: string, today: Date): StudentProgram {
  const match = groupName.trim().match(GROUP_PATTERN);

  if (!match) {
    return {
      university: INVALID_GROUP_LABEL,
      direction: INVALID_GROUP_LABEL,
      course: INVALID_GROUP_LABEL,
      semester: INVALID_GROUP_LABEL,
      studyForm: INVALID_GROUP_LABEL,
    };
  }

  const [, instituteCode, yearDigitStr, directionDigitStr] = match;
  const { course, semester } = resolveCourseAndSemester(Number(yearDigitStr), today);

  return {
    university: INSTITUTE_BY_CODE[instituteCode] ?? UNKNOWN_VALUE,
    direction: DIRECTION_BY_INSTITUTE[instituteCode]?.[directionDigitStr] ?? UNKNOWN_VALUE,
    course: `${course} курс`,
    semester: `${semester} семестр`,
    studyForm: DEFAULT_STUDY_FORM,
  };
}
