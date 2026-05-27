'use client';

import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    height: 72,
    backgroundColor: 'var(--color-input-bg)',
    borderRadius: '10px',
    '& fieldset': { border: 'none' },
    '&:hover fieldset': { border: 'none' },
    '&.Mui-focused fieldset': {
      border: '2px solid var(--color-brand)',
    },
  },
  '& .MuiInputBase-input': {
    px: '22px',
    py: '20px',
    fontSize: '18px',
    fontWeight: 500,
    color: 'var(--color-text-primary)',
  },
  '& .MuiInputBase-input::placeholder': {
    color: 'var(--color-text-secondary)',
    opacity: 1,
  },
};

export function AuthTextField(props: TextFieldProps) {
  return <TextField {...props} sx={fieldSx} />;
}
