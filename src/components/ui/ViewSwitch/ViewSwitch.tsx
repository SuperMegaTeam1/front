'use client';

import styles from './ViewSwitch.module.scss';

interface ViewSwitchOption<T extends string> {
  value: T;
  label: string;
}

interface ViewSwitchProps<T extends string> {
  options: ViewSwitchOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function ViewSwitch<T extends string>({ options, value, onChange }: ViewSwitchProps<T>) {
  return (
    <div className={styles.root} role="tablist" aria-label="Переключатель вида">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          className={`${styles.button} ${value === option.value ? styles.buttonActive : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
