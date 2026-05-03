'use client';

import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import styles from './LogoutButton.module.scss';

interface LogoutButtonProps {
  onClick: () => void;
  label?: string;
}

export function LogoutButton({ onClick, label = 'Выйти из аккаунта' }: LogoutButtonProps) {
  return (
    <button type="button" className={styles.root} onClick={onClick}>
      <LogoutRoundedIcon sx={{ fontSize: 16 }} />
      {label}
    </button>
  );
}
