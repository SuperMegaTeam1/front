/**
 * Утилита для условного объединения CSS-классов.
 * Пример: cn(styles.card, isActive && styles.active, className)
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
