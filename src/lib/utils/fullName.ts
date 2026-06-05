/**
 * Утилиты для работы с ФИО студентов.
 * Раньше эти функции дублировались в страницах журнала группы и занятия.
 */

/** Собирает полное ФИО из частей: «Фамилия Имя Отчество». */
export function joinFullName(lastName: string, firstName: string, fatherName?: string | null) {
  return `${lastName} ${firstName}${fatherName ? ` ${fatherName}` : ''}`.trim();
}

/** Сокращает ФИО до вида «Фамилия И. О.». */
export function formatShortFullName(fullName: string) {
  const [lastName, firstName, fatherName] = fullName.trim().split(/\s+/);

  if (!lastName || !firstName) {
    return fullName;
  }

  return `${lastName} ${firstName[0]}.${fatherName ? ` ${fatherName[0]}.` : ''}`.trim();
}

/** Инициалы «ФИ» из полного ФИО — для аватарок. */
export function getInitials(fullName: string) {
  const [lastName, firstName] = fullName.trim().split(/\s+/);
  return `${lastName?.[0] ?? ''}${firstName?.[0] ?? ''}`.toUpperCase();
}

/** Инициалы из отдельных полей имени и фамилии (для аватара в шапке). */
export function getUserInitials(firstName?: string | null, lastName?: string | null) {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.trim();
}
