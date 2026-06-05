import { getGradeInputClassName } from './gradebook.helpers';

interface GradeInputProps {
  value: string;
  isDirty: boolean;
  ariaLabel: string;
  onChange: (value: string) => void;
}

export function GradeInput({ value, isDirty, ariaLabel, onChange }: GradeInputProps) {
  return (
    <input
      type="text"
      inputMode="text"
      maxLength={3}
      value={value}
      className={getGradeInputClassName(value, isDirty)}
      onChange={(event) => onChange(event.target.value)}
      aria-label={ariaLabel}
    />
  );
}
