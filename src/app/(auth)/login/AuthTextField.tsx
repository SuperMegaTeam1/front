'use client';

import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    height: 72,
    backgroundColor: '#dbe4e7',
    borderRadius: '10px',
    '& fieldset': { border: 'none' },
    '&:hover fieldset': { border: 'none' },
    '&.Mui-focused fieldset': {
      border: '2px solid #2a657e',
    },
  },
  '& .MuiInputBase-input': {
    px: '22px',
    py: '20px',
    fontSize: '18px',
    fontWeight: 500,
    color: '#2b3437',
  },
  '& .MuiInputBase-input::placeholder': {
    color: '#94a3b8',
    opacity: 1,
  },
};

export function AuthTextField(props: TextFieldProps) {
  return <TextField {...props} sx={fieldSx} />;
}
