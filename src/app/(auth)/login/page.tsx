'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button, Typography } from '@mui/material';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { useAuth } from '@/lib/hooks/useAuth';
import type { LoginPayload } from '@/types/api';
import { AuthTextField } from './AuthTextField';
import styles from './login.module.scss';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggingIn, loginError, user, isAuthenticated } = useAuth();
  const { control, handleSubmit } = useForm<LoginPayload>({
    defaultValues: { login: '', password: '' },
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    router.replace(user.role === 'student' ? '/student/home' : '/teacher/home');
  }, [isAuthenticated, router, user]);

  const onSubmit = (data: LoginPayload) => login(data);
  return (
    <div className={styles.page}>
      <div className={styles.decorCircle} />
      <div className={styles.decorFrame} />

      <div className={styles.content}>
        <div className={styles.logoBlock}>
          <div className={styles.logoIconWrap}>
            <SchoolOutlinedIcon sx={{ fontSize: 52, color: '#2a657e' }} />
          </div>
          <Typography className={styles.title}>Мой ИВМиИТ</Typography>
          <Typography className={styles.subtitle}>Цифровой кабинет студента</Typography>
        </div>

        <div className={styles.card}>
          <form onSubmit={handleSubmit(onSubmit)} noValidate className={styles.form}>
            <div className={styles.fields}>
              <div className={styles.field}>
                <Typography className={styles.label}>ЛОГИН</Typography>
                <Controller
                  name="login"
                  control={control}
                  rules={{ required: 'Введите логин' }}
                  render={({ field, fieldState }) => (
                    <AuthTextField
                      {...field}
                      fullWidth
                      size="small"
                      placeholder="ivanov.i"
                      autoComplete="username"
                      error={!!fieldState.error}
                    />
                  )}
                />
              </div>

              <div className={styles.field}>
                <Typography className={styles.label}>ПАРОЛЬ</Typography>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: 'Введите пароль' }}
                  render={({ field, fieldState }) => (
                    <AuthTextField
                      {...field}
                      type="password"
                      fullWidth
                      size="small"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      error={!!fieldState.error}
                    />
                  )}
                />
              </div>
            </div>

            {loginError && (
              <Typography className={styles.errorText}>
                Неверный логин или пароль. Попробуйте ещё раз.
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              disabled={isLoggingIn}
              className={styles.submitBtn}
              disableElevation
            >
              {isLoggingIn ? 'ВХОДИМ...' : 'ВОЙТИ'}
            </Button>
          </form>

          <Typography className={styles.helperText}>
            Используйте ваши университетские учётные данные для входа
          </Typography>
        </div>

      </div>
    </div>
  );
}
