'use client';

import { useForm, Controller } from 'react-hook-form';
import { TextField, CircularProgress } from '@mui/material';
import { useAuth } from '@/lib/hooks/useAuth';
import type { LoginPayload } from '@/types/api';
import styles from './login.module.scss';

const LOGO_ICON = 'https://www.figma.com/api/mcp/asset/2348398c-905e-43a4-b18a-79eed7ea964f';

export default function LoginPage() {
  const { login, isLoggingIn, loginError } = useAuth();

  const { control, handleSubmit } = useForm<LoginPayload>({
    defaultValues: { login: '', password: '' },
  });

  const onSubmit = (data: LoginPayload) => {
    login(data);
  };

  return (
    <main className={styles.root}>
      <div className={styles.bgLeft} aria-hidden />
      <div className={styles.bgRight} aria-hidden />

      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoWrap}>
            <img src={LOGO_ICON} alt="" width={33} height={27} />
          </div>
          <h1 className={styles.title}>Мой ИВМИиТ</h1>
          <p className={styles.subtitle}>Цифровой кабинет студента</p>
        </div>

        {/* Card */}
        <div className={styles.card}>
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)} noValidate>
            <Controller
              name="login"
              control={control}
              rules={{ required: 'Введите логин' }}
              render={({ field, fieldState }) => (
                <div className={styles.field}>
                  <label className={styles.label}>ЛОГИН</label>
                  <TextField
                    {...field}
                    variant="filled"
                    placeholder="ivanov.i"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputProps={{ disableUnderline: false }}
                    sx={{
                      '& .MuiFilledInput-root': {
                        backgroundColor: '#dbe4e7',
                        borderRadius: '4px 4px 0 0',
                        paddingTop: '18px',
                        paddingBottom: '18px',
                        '&:hover': { backgroundColor: '#cfd8dc' },
                        '&.Mui-focused': { backgroundColor: '#dbe4e7' },
                      },
                      '& .MuiFilledInput-input': {
                        padding: '0 0',
                        fontSize: '16px',
                        fontFamily: 'var(--font-ibm-plex-sans), sans-serif',
                        color: '#586064',
                      },
                      '& .MuiInputBase-input::placeholder': { color: '#abb3b7', opacity: 1 },
                    }}
                  />
                </div>
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{ required: 'Введите пароль' }}
              render={({ field, fieldState }) => (
                <div className={styles.field}>
                  <label className={styles.label}>ПАРОЛЬ</label>
                  <TextField
                    {...field}
                    type="password"
                    variant="filled"
                    placeholder="••••••••"
                    fullWidth
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputProps={{ disableUnderline: false }}
                    sx={{
                      '& .MuiFilledInput-root': {
                        backgroundColor: '#dbe4e7',
                        borderRadius: '4px 4px 0 0',
                        paddingTop: '18px',
                        paddingBottom: '18px',
                        '&:hover': { backgroundColor: '#cfd8dc' },
                        '&.Mui-focused': { backgroundColor: '#dbe4e7' },
                      },
                      '& .MuiFilledInput-input': {
                        padding: '0 0',
                        fontSize: '16px',
                        fontFamily: 'var(--font-ibm-plex-sans), sans-serif',
                        color: '#586064',
                      },
                      '& .MuiInputBase-input::placeholder': { color: '#abb3b7', opacity: 1 },
                    }}
                  />
                </div>
              )}
            />

            {loginError && (
              <p className={styles.error}>Неверный логин или пароль</p>
            )}

            <button type="submit" className={styles.submitBtn} disabled={isLoggingIn}>
              {isLoggingIn ? <CircularProgress size={20} color="inherit" /> : 'ВОЙТИ'}
            </button>
          </form>

          <p className={styles.helperText}>
            Используйте ваши университетские
            <br />
            учётные данные для входа
          </p>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button type="button" className={styles.forgotLink}>Забыли пароль?</button>
        </div>
      </div>
    </main>
  );
}
