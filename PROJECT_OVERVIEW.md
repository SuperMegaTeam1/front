# PROJECT_OVERVIEW — moi-ivmiit-front

Краткий справочник «куда что класть» для разработчика, который только заходит в проект. Показывает **как реально устроен репозиторий**, **куда писать каждый тип кода** и **какие паттерны уже приняты**.

Смежные документы:
- **[FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md)** — большой обучающий гайд: каждый инструмент стека + каждый файл + архитектурные паттерны.
- **[API_GUIDE.md](./API_GUIDE.md)** — контракт фронт ↔ бэк (эндпоинты, формат ответов, auth).
- **[../wiki/](../wiki/)** — база знаний в Obsidian (концепты, решения, логи).

---

## 1. Что это за проект

- **Имя:** `moi-ivmiit-front` (v0.1.0).
- **Назначение:** учебный портал ИВМиИТ с двумя ролями — студент и преподаватель (расписание, оценки, рейтинг, уведомления, профиль, журнал у преподавателя).
- **Язык UI:** русский. В корневом `layout.tsx` стоит `lang="ru"`, в MUI-теме подключена локаль `ruRU`.
- **Состояние:** уже не скелет — настроены провайдеры, axios с интерсепторами, Zustand-сторы, TanStack Query-хуки, MUI-тема с токенами из Figma (бренд `#2a657e`), шрифты Manrope + IBM Plex Sans через `next/font`, SCSS-дизайн-токены, скелеты e2e-тестов. Компоненты (`Header`, `Sidebar`, `SubjectCard`, страницы) — заглушки и ждут реализации.

### Стек и версии

| Область | Технология | Версия |
|---|---|---|
| Фреймворк | Next.js (App Router) | ^16.2.4 |
| UI-рантайм | React | ^19.1.0 |
| Язык | TypeScript | ^5.8.3 |
| Компонентная UI-библиотека | Material UI | ^6.4.0 |
| Стили (CSS) | Sass / SCSS Modules | ^1.87.0 |
| Клиентский стейт | Zustand | ^5.0.12 |
| Серверный стейт / кэш | TanStack Query | ^5.99.0 |
| HTTP-клиент | Axios | ^1.15.0 |
| Формы | React Hook Form | ^7.72.1 |
| Линтер | ESLint | ^9.26.0 |
| Unit-тесты | Vitest + Testing Library | ^3.1.2 |
| E2E-тесты | Playwright | ^1.52.0 |

---

## 2. Карта репозитория

```
d:/front/repos/front/
├── .github/workflows/frontend-ci.yml   — CI pipeline
├── eslint.config.mjs                   — ESLint flat config
├── next.config.ts                      — Next.js config (SCSS опции)
├── playwright.config.ts                — Playwright config
├── tsconfig.json                       — TS + алиас @/* → ./src/*
├── vitest.config.ts                    — Vitest + алиас
├── package.json                        — скрипты и зависимости
├── src/
│   ├── app/                            — App Router: layouts + pages
│   │   ├── layout.tsx                  — корневой layout (AppRouterCacheProvider + Providers)
│   │   ├── page.tsx                    — главная "/"
│   │   ├── not-found.tsx               — 404
│   │   ├── globals.scss                — глобальные стили
│   │   ├── (auth)/                     — route group без влияния на URL
│   │   │   ├── layout.tsx
│   │   │   └── login/page.tsx          — /login
│   │   └── (dashboard)/
│   │       ├── layout.tsx
│   │       ├── student/…               — /student/*
│   │       └── teacher/…               — /teacher/*
│   ├── components/
│   │   ├── layout/                     — Header, Sidebar, PageContainer
│   │   ├── shared/                     — доменные: SubjectCard, RatingTable, ScheduleGrid, NotificationItem
│   │   └── stack-check/StackCheckClient.tsx — демо-компонент проверки стека
│   │   (папка ui/ удалена — не плодим обёртки над MUI)
│   ├── lib/
│   │   ├── api/                        — axios-инстанс + <feature>.api.ts сервисы
│   │   ├── hooks/                      — TanStack Query хуки (use<Feature>.ts)
│   │   └── utils/                      — cn, exportCsv, formatDate
│   ├── providers/
│   │   ├── Providers.tsx               — композитор QueryProvider + ThemeProvider
│   │   ├── QueryProvider.tsx           — TanStack Query
│   │   └── ThemeProvider.tsx           — MUI тема + CssBaseline
│   ├── stores/                         — Zustand-сторы (use<Name>Store.ts)
│   ├── styles/                         — _variables.scss, _mixins.scss, _typography.scss
│   ├── tests/setup.ts                  — setup для Vitest
│   └── types/                          — TS-типы по фичам
└── tests/e2e/                          — Playwright e2e
```

---

## 3. Роутинг (App Router)

Используется **App Router** (`src/app/`), НЕ Pages Router. Все страницы — файлы `page.tsx` внутри сегментов папок.

### Группы маршрутов

Папки `(auth)` и `(dashboard)` — это **route groups**: скобки не попадают в URL, они нужны только для того, чтобы дать разные `layout.tsx` разным областям приложения.

### Текущий набор страниц

| URL | Файл |
|---|---|
| `/` | [src/app/page.tsx](src/app/page.tsx) |
| `/login` | [src/app/(auth)/login/page.tsx](src/app/(auth)/login/page.tsx) |
| `/student/schedule` | [src/app/(dashboard)/student/schedule/page.tsx](src/app/(dashboard)/student/schedule/page.tsx) |
| `/student/subjects` | [src/app/(dashboard)/student/subjects/page.tsx](src/app/(dashboard)/student/subjects/page.tsx) |
| `/student/subjects/[id]` | [src/app/(dashboard)/student/subjects/[id]/page.tsx](src/app/(dashboard)/student/subjects/[id]/page.tsx) |
| `/student/rating` | [src/app/(dashboard)/student/rating/page.tsx](src/app/(dashboard)/student/rating/page.tsx) |
| `/student/profile` | [src/app/(dashboard)/student/profile/page.tsx](src/app/(dashboard)/student/profile/page.tsx) |
| `/student/notifications` | [src/app/(dashboard)/student/notifications/page.tsx](src/app/(dashboard)/student/notifications/page.tsx) |
| `/teacher/schedule` | [src/app/(dashboard)/teacher/schedule/page.tsx](src/app/(dashboard)/teacher/schedule/page.tsx) |
| `/teacher/subjects` | [src/app/(dashboard)/teacher/subjects/page.tsx](src/app/(dashboard)/teacher/subjects/page.tsx) |
| `/teacher/subjects/[subjectId]/gradebook/[groupId]` | `.../gradebook/[groupId]/page.tsx` |
| `/teacher/subjects/[subjectId]/lesson/[id]` | `.../lesson/[id]/page.tsx` |
| `/teacher/profile`, `/teacher/notifications` | аналогично |
| `*` (404) | [src/app/not-found.tsx](src/app/not-found.tsx) |

### Как добавить страницу

Пример: нужна `/student/grades`.

1. Создать файл **`src/app/(dashboard)/student/grades/page.tsx`**.
2. Если на странице будет интерактив / MUI / Zustand / TanStack Query — первая строка `'use client';`. Серверные компоненты в этом проекте сейчас почти не используются, всё клиентское.
3. Опционально рядом:
   - `layout.tsx` — обёртка для всей подветки,
   - `loading.tsx` — скелетон во время навигации,
   - `error.tsx` — ошибка рендера,
   - `not-found.tsx` — 404 в рамках сегмента.
4. Динамический параметр — папка `[id]`:
   ```tsx
   // src/app/(dashboard)/student/grades/[id]/page.tsx
   'use client';
   export default function Page({ params }: { params: { id: string } }) {
     return <div>Оценка {params.id}</div>;
   }
   ```

Пример готовой страницы с загрузкой данных — [src/app/(dashboard)/student/subjects/page.tsx](src/app/(dashboard)/student/subjects/page.tsx) (использует `useSubjects()`).

---

## 4. TypeScript

### Конфиг
`tsconfig.json`:
- `strict: true`, `target: ES2017`, `moduleResolution: bundler`, `jsx: react-jsx`.
- Алиас **`@/*` → `./src/*`**. Тот же алиас прописан в `vitest.config.ts`, чтобы тесты видели те же пути.

Пример импорта: `import { useAuthStore } from '@/stores/useAuthStore';`.

### Куда писать типы

Все доменные типы лежат в **[src/types/](src/types/)**, по одному файлу на фичу:

| Файл | Содержит |
|---|---|
| [src/types/api.ts](src/types/api.ts) | `ApiResponse<T>`, `PaginatedResponse<T>`, `ApiError`, `LoginPayload`, `LoginResponse` |
| [src/types/user.ts](src/types/user.ts) | `Role` ('student' \| 'teacher'), `User`, `Student`, `Teacher` |
| [src/types/subject.ts](src/types/subject.ts) | `Subject`, `SubjectDetail` |
| [src/types/schedule.ts](src/types/schedule.ts) | типы расписания |
| [src/types/grade.ts](src/types/grade.ts) | типы оценок |
| [src/types/attendance.ts](src/types/attendance.ts) | типы посещаемости |
| [src/types/rating.ts](src/types/rating.ts) | типы рейтинга |
| [src/types/notification.ts](src/types/notification.ts) | типы уведомлений |

### Соглашение API-ответов

Бэкенд **всегда возвращает конверт**:
```ts
interface ApiResponse<T> { data: T; message?: string }
```
Поэтому в хуках видим распаковку `.data.data` (см. раздел 7).

**Правило:** новый домен = новый файл в `src/types/`, экспорты именованные (`export interface Foo`).

---

## 5. Стили — SCSS Modules + MUI

В проекте **две параллельные системы стилей**, они не конфликтуют:

### 5.1 Глобальные SCSS-токены

[src/styles/](src/styles/):

- **`_variables.scss`** — дизайн-токены (цвета из Figma, spacing 4px-база, радиусы, тени, transitions, breakpoints, размеры header/sidebar). **Всегда берите значения отсюда, не хардкодьте.** Подробнее — [[wiki/concepts/design-tokens]].
  ```scss
  $color-brand: #2a657e;        $spacing-md: 16px;
  $color-brand-light: #bfe8ff;  $radius-md: 8px;
  $color-bg: #f8f9fa;           $bp-tablet: 768px;
  $color-text-primary: #2b3437; $header-height: 73px;
  ```
- **`_typography.scss`** — `$font-family` = IBM Plex Sans (тело), `$font-family-heading` = Manrope (заголовки), шкала размеров, веса (до ExtraBold 800), line-heights. Шрифты подключаются через `next/font/google` в `app/layout.tsx` как CSS-переменные `--font-ibm-plex-sans` и `--font-manrope`.
- **`_mixins.scss`** — готовые миксины: `mobile`, `tablet`, `desktop` (медиа-запросы), `flex-center`, `flex-between`, `truncate`, `line-clamp($lines)`, `glass`, `card`.

Подключаются в любой `.module.scss` через:
```scss
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;
```

Глобальный reset + базовые стили — [src/app/globals.scss](src/app/globals.scss), импортируется один раз в корневом `layout.tsx`.

### 5.2 Локальные стили — SCSS Modules

Шаблон: рядом с компонентом лежит `ComponentName.module.scss`:
```
src/components/shared/SubjectCard/
├── SubjectCard.tsx
└── SubjectCard.module.scss
```
В TS:
```tsx
import styles from './SubjectCard.module.scss';
<div className={styles.root}>…</div>
```

### 5.3 MUI-тема

[src/providers/ThemeProvider.tsx](src/providers/ThemeProvider.tsx):

```tsx
const theme = createTheme({
  palette: {
    primary:    { main: '#2a657e', light: '#bfe8ff', dark: '#004b63' },
    secondary:  { main: '#7c4dff' },
    background: { default: '#f8f9fa', paper: '#ffffff' },
    text:       { primary: '#2b3437', secondary: '#94a3b8' },
    divider:    '#e3e9ec',
  },
  typography: {
    fontFamily: "var(--font-ibm-plex-sans), 'IBM Plex Sans', sans-serif",
    h1: { fontFamily: "var(--font-manrope), 'Manrope', sans-serif", fontWeight: 800 },
    h2: { fontFamily: "var(--font-manrope), sans-serif", fontWeight: 800 },
    h3: { fontFamily: "var(--font-manrope), sans-serif", fontWeight: 700 },
    h4: { fontFamily: "var(--font-manrope), sans-serif", fontWeight: 700 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
    MuiCard:   { styleOverrides: { root: { boxShadow: '0 1px 2px rgba(0,0,0,.05)', border: '1px solid rgba(227,233,236,0.4)' } } },
  },
}, ruRU);
```
- Рядом подключается **`<CssBaseline />`** — нормализация стилей.
- Эмоциональный кэш для SSR — `AppRouterCacheProvider` из `@mui/material-nextjs/v16-appRouter` в `app/layout.tsx`.

**Цвета в теме и в `_variables.scss` должны совпадать по хексам.** Если меняете палитру — правьте оба места одновременно.

**Правило переопределения MUI:** прежде чем писать свою обёртку над MUI-компонентом — обсудить. В 90% случаев задача решается через `theme.components.Mui<X>.styleOverrides`/`defaultProps`, через `sx={{...}}`, или через `className` + `.module.scss`. Папка `components/ui/` **удалена** (апрель 2026) — была заглушкой.

### 5.4 Когда MUI, когда SCSS Module

- **MUI** — там, где важны доступность, поведение, готовая логика: кнопки, инпуты, модалки, меню, даты, таблицы.
- **SCSS Modules** — layout, обёртки, кастомные визуальные карточки, grid-раскладки, где MUI избыточен.
- Микс: можно брать MUI-компонент и добавлять ему `className` с модульным стилем.

---

## 6. Zustand — клиентский стейт

Сторы лежат в **[src/stores/](src/stores/)**, одно состояние = один файл.

### Соглашение
- Имя файла: `use<Name>Store.ts`.
- Экспорт именованный: `export const useAuthStore = create<AuthState>()(...)`.
- Интерфейс state типизирован отдельно.
- Для долгоживущих данных — middleware **`persist`** с явным `name` (ключ в `localStorage`).

### Существующие сторы

| Store | Что хранит |
|---|---|
| [src/stores/useAuthStore.ts](src/stores/useAuthStore.ts) | `user`, `accessToken`, `refreshToken`, `isAuthenticated`; экшены `setAuth`, `logout`, `setAccessToken`, `getRole`. **Персистится** в `localStorage` под ключом `auth-storage`. ⚠️ **TODO(auth):** переходим на HttpOnly cookies — см. [wiki/concepts/auth-strategy.md](../wiki/concepts/auth-strategy.md). |
| [src/stores/useUiStore.ts](src/stores/useUiStore.ts) | `isSidebarOpen`, `toggleSidebar`, `setSidebarOpen`. |
| [src/stores/useNotificationStore.ts](src/stores/useNotificationStore.ts) | `unreadCount`, `setUnreadCount`, `decrementUnread`. |

### Как добавить новый стор

```ts
// src/stores/useThemeStore.ts
import { create } from 'zustand';

interface ThemeState {
  mode: 'light' | 'dark';
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>()((set) => ({
  mode: 'light',
  toggle: () => set((s) => ({ mode: s.mode === 'light' ? 'dark' : 'light' })),
}));
```
Если надо пережить перезагрузку страницы — оборачиваете в `persist(...)`, как в `useAuthStore`.

**Важно:**
- серверные данные (списки предметов, расписание) **НЕ кладите в Zustand** — это зона TanStack Query;
- булевые — через глагол (`isLoading`, `hasPermission`, `canSubmit`). Проверяется правилом ESLint `@typescript-eslint/naming-convention`.

---

## 7. API-слой — Axios + TanStack Query

Архитектура трёхслойная: **типы → axios-сервис → query-хук → компонент**. Компонент **никогда** не вызывает axios напрямую.

### 7.1 Axios-инстанс
[src/lib/api/axios.ts](src/lib/api/axios.ts):

```ts
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// request: подставляет JWT из useAuthStore
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// response: при 401 — logout + редирект на /login
api.interceptors.response.use((r) => r, (error) => {
  if (error.response?.status === 401) {
    useAuthStore.getState().logout();
    if (typeof window !== 'undefined') window.location.href = '/login';
  }
  return Promise.reject(error);
});
```

- База читается из переменной окружения `NEXT_PUBLIC_API_URL` (см. раздел 12).
- Токен читается **из Zustand-стора**, а не из cookies.

⚠️ **TODO(auth):** после готовности бэка перейдём на HttpOnly cookies — `axios.create({ withCredentials: true })`, request-интерсептор с `Authorization: Bearer` уйдёт, кука поедет сама. Подробности — [wiki/concepts/auth-strategy.md](../wiki/concepts/auth-strategy.md).

### 7.2 Сервисы (тонкие обёртки над axios)

[src/lib/api/](src/lib/api/), по файлу на фичу: `auth.api.ts`, `subjects.api.ts`, `grades.api.ts`, `schedule.api.ts`, `rating.api.ts`, `attendance.api.ts`, `notifications.api.ts`, `users.api.ts`.

Пример — [src/lib/api/subjects.api.ts](src/lib/api/subjects.api.ts):
```ts
import api from './axios';
import type { ApiResponse } from '@/types/api';
import type { Subject, SubjectDetail } from '@/types/subject';

export const getSubjects = () =>
  api.get<ApiResponse<Subject[]>>('/subjects');

export const getSubjectById = (id: number) =>
  api.get<ApiResponse<SubjectDetail>>(`/subjects/${id}`);
```

Возвращают **сырой `AxiosResponse`**, распаковку делает хук.

### 7.3 TanStack Query-хуки

[src/lib/hooks/](src/lib/hooks/), по файлу на фичу: `useAuth.ts`, `useSubjects.ts`, `useGrades.ts`, `useSchedule.ts`, `useRating.ts`, `useNotifications.ts`.

Пример — [src/lib/hooks/useSubjects.ts](src/lib/hooks/useSubjects.ts):
```ts
'use client';
import { useQuery } from '@tanstack/react-query';
import { getSubjects, getSubjectById } from '@/lib/api/subjects.api';

export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: () => getSubjects().then((r) => r.data.data),
  });
}

export function useSubjectDetail(id: number) {
  return useQuery({
    queryKey: ['subjects', id],
    queryFn: () => getSubjectById(id).then((r) => r.data.data),
    enabled: !!id,
  });
}
```

Мутация с инвалидацией кэша — [src/lib/hooks/useGrades.ts](src/lib/hooks/useGrades.ts):
```ts
export function useSetGrades() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SetGradePayload[]) => setGrades(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gradebook'] });
      qc.invalidateQueries({ queryKey: ['grades'] });
    },
  });
}
```

**Паттерны хуков в проекте:**
- `queryKey` — массив-иерархия: `['feature']`, `['feature', id]`, `['feature', 'sub', id]`.
- Распаковка данных — `.then((r) => r.data.data)` (внешний `.data` от axios, внутренний — конверт `ApiResponse`).
- Зависимые запросы — `enabled: !!id`.
- Поллинг — `refetchInterval: 30_000` (пример — `useUnreadCount`).
- После мутации — `queryClient.invalidateQueries({ queryKey: [...] })`.

### 7.4 QueryClient defaults
[src/providers/QueryProvider.tsx](src/providers/QueryProvider.tsx):
- `refetchOnWindowFocus: false`
- `retry: 1`
- `staleTime: 5 * 60 * 1000` (5 минут)

Значит: после первого запроса данные 5 минут считаются свежими, повторный рендер не триггерит лишний fetch.

### 7.5 Рецепт «добавить фичу с API»

Допустим, нужна работа с «группами»:

1. **Тип:** [src/types/group.ts](src/types/group.ts) — `interface Group { id: number; name: string; … }`.
2. **Сервис:** [src/lib/api/groups.api.ts](src/lib/api/groups.api.ts) — `getGroups()`, `createGroup(payload)`.
3. **Хук:** [src/lib/hooks/useGroups.ts](src/lib/hooks/useGroups.ts) — `useGroups()`, `useCreateGroup()` с инвалидацией.
4. **Компонент:** `const { data, isLoading } = useGroups();` — и рендер.

---

## 8. React Hook Form

**Статус:** библиотека установлена (`react-hook-form@^7.72.1`), но **в коде пока не используется**. UI-компоненты (`Input`, `Button` и т.д.) — заглушки.

Когда будете реализовывать форму (например, логин на `/login`), паттерн для MUI-инпутов:

```tsx
'use client';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button } from '@mui/material';
import { useAuth } from '@/lib/hooks/useAuth';

interface LoginForm { login: string; password: string; }

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const { control, handleSubmit } = useForm<LoginForm>({
    defaultValues: { login: '', password: '' },
  });

  return (
    <form onSubmit={handleSubmit((v) => login(v))}>
      <Controller
        name="login" control={control} rules={{ required: 'Введите логин' }}
        render={({ field, fieldState }) => (
          <TextField {...field} label="Логин"
            error={!!fieldState.error} helperText={fieldState.error?.message} />
        )}
      />
      {/* аналогично password */}
      <Button type="submit" disabled={isLoggingIn}>Войти</Button>
    </form>
  );
}
```

Для валидации в будущем можно подключить `zod` + `@hookform/resolvers` (сейчас не установлены).

---

## 9. Провайдеры и порядок обёртки

[src/app/layout.tsx](src/app/layout.tsx):
```tsx
import { Manrope, IBM_Plex_Sans } from 'next/font/google';

// Шрифты грузятся на этапе сборки, хостятся локально, связаны с CSS-переменными
const manrope = Manrope({ subsets: ['latin', 'cyrillic'], weight: ['400','500','600','700','800'], variable: '--font-manrope', display: 'swap' });
const ibmPlexSans = IBM_Plex_Sans({ subsets: ['latin', 'cyrillic'], weight: ['400','500','600'], variable: '--font-ibm-plex-sans', display: 'swap' });

<html lang="ru" className={`${manrope.variable} ${ibmPlexSans.variable}`}>
  <body>
    <AppRouterCacheProvider>    {/* MUI emotion cache для App Router */}
      <Providers>{children}</Providers>
    </AppRouterCacheProvider>
  </body>
</html>
```

[src/providers/Providers.tsx](src/providers/Providers.tsx):
```tsx
'use client';
<QueryProvider>          {/* TanStack Query */}
  <ThemeProvider>        {/* MUI theme + CssBaseline */}
    {children}
```

Итоговая вложенность:
```
AppRouterCacheProvider → QueryProvider → ThemeProvider → <children>
```

---

## 10. Тестирование

### 10.1 Unit — Vitest + Testing Library

Конфиг — [vitest.config.ts](vitest.config.ts):
- `environment: 'jsdom'`, `globals: true` (не нужно импортировать `describe/it`).
- `setupFiles: ['./src/tests/setup.ts']` — в сетапе подключён `@testing-library/jest-dom`.
- Паттерн — `src/**/*.{test,spec}.{ts,tsx}` — **тесты колоцируются рядом с исходником**.
- Алиас `@/` работает.
- `passWithNoTests: true` — пустой прогон не валит CI.

**Юнит-тестов пока нет** — можно начинать. Шаблон:
```tsx
// src/components/shared/SubjectCard/SubjectCard.test.tsx
import { render, screen } from '@testing-library/react';
import { SubjectCard } from './SubjectCard';

test('рендерит название предмета', () => {
  render(<SubjectCard name="Базы данных" groups="09-351" />);
  expect(screen.getByText('Базы данных')).toBeInTheDocument();
});
```
Запуск: `npm test`, UI — `npm run test:ui`.

### 10.2 E2E — Playwright

Конфиг — [playwright.config.ts](playwright.config.ts):
- `testDir: './tests/e2e'`.
- Только `chromium` (Desktop Chrome).
- `baseURL: http://localhost:3000`.
- `webServer`: автоматически поднимает `npm run dev` перед тестами.

Существующие примеры: [tests/e2e/auth.spec.ts](tests/e2e/auth.spec.ts), [tests/e2e/student-schedule.spec.ts](tests/e2e/student-schedule.spec.ts), [tests/e2e/teacher-gradebook.spec.ts](tests/e2e/teacher-gradebook.spec.ts).

Запуск: `npm run test:e2e`, UI-режим — `npm run test:e2e:ui`.

---

## 11. Код-качество и CI

### ESLint
[eslint.config.mjs](eslint.config.mjs) — flat-config:
```js
export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'variable',  types: ['boolean'], format: ['PascalCase'], prefix: ['is','has','can','should','will','did'] },
        { selector: 'parameter', types: ['boolean'], format: ['PascalCase'], prefix: ['is','has','can','should','will','did'] },
      ],
    },
  },
]);
```
Берётся `eslint-config-next/core-web-vitals` + TS-пресет + кастомное правило на булевые (введено по ревью Дмитрия, PR #1, замечание №7).

Запуск: `npm run lint` (под капотом `eslint .`).

### Prettier
**Не установлен.** Форматирование не автоматизировано — договоритесь внутри команды.

### Husky / lint-staged
**Не настроены.** Pre-commit хуков нет.

### CI
[.github/workflows/frontend-ci.yml](.github/workflows/frontend-ci.yml):

- **Триггеры:** push в `main`, `develop`, `feat/**`, `fix/**`, `chore/**`; PR в `main` и `develop`.
- **Шаги:** checkout → Node 20 → детект package-manager → `npm ci` → `npm run lint` → `npm run test` (Vitest) → `npm run build`.
- **E2E в CI не запускаются** — только локально.

---

## 12. Переменные окружения

- **`NEXT_PUBLIC_API_URL`** — база для axios (читается в [src/lib/api/axios.ts](src/lib/api/axios.ts)).
- Префикс `NEXT_PUBLIC_` обязателен: иначе переменная не доедет до клиентского кода.
- Локально — файл `.env.local` в корне (в `.gitignore`). Пример:
  ```
  NEXT_PUBLIC_API_URL=https://api.example.com
  ```

---

## 13. Быстрые рецепты «хочу → делаю»

| Хочу | Куда |
|---|---|
| Новая страница (не интерактив) | `src/app/<group>/<path>/page.tsx` — серверный компонент по умолчанию |
| Новая страница с MUI/Query/Zustand | то же + `'use client';` первой строкой |
| Готовая кнопка/инпут/меню | `import { Button } from '@mui/material'` напрямую |
| Доменный компонент (SubjectCard, RatingTable) | `src/components/shared/<Name>/…` + `<Name>.module.scss` |
| Layout-блок (Header, Sidebar) | `src/components/layout/<Name>/…` |
| Новый тип | `src/types/<feature>.ts` |
| Новый HTTP-вызов | сервис в `src/lib/api/<feature>.api.ts` |
| Новый query/mutation-хук | `src/lib/hooks/use<Feature>.ts` |
| Новый глобальный стор | `src/stores/use<Name>Store.ts` (+`persist` при необходимости) |
| Новый SCSS-токен (цвет, отступ) | `src/styles/_variables.scss` + **синхронизировать с MUI-темой** |
| Новый SCSS-миксин | `src/styles/_mixins.scss` |
| Форма | React Hook Form + MUI-инпуты через `<Controller>` (см. раздел 8) |
| Unit-тест | `<file>.test.ts(x)` рядом с исходником |
| E2E-тест | `tests/e2e/<feature>.spec.ts` |
| Защитить роут по роли | проверять `useAuthStore.getState().user.role` в `layout.tsx` группы (middleware в `src/proxy.ts` сломан — требует переименования в `middleware.ts` и реализации) |
| Свой компонент поверх MUI | **сначала обсудить**: чаще всего достаточно `sx` или `className` |

---

## 14. Команды

```bash
npm run dev          # dev-сервер на :3000
npm run build        # prod-сборка
npm start            # запуск prod-сборки

npm run lint         # ESLint
npm test             # Vitest (watch)
npm run test:ui      # Vitest UI
npm run test:e2e     # Playwright
npm run test:e2e:ui  # Playwright UI
```

---

## 15. Чек-лист «прежде чем коммитить»

- [ ] `npm run lint` — чисто.
- [ ] `npm test` — зелёный (если трогал логику).
- [ ] `npm run build` — собирается.
- [ ] Новые цвета/отступы — через `_variables.scss`, не хардкод.
- [ ] Новые API-вызовы — через сервис + хук, не напрямую axios в компоненте.
- [ ] Клиентские компоненты помечены `'use client'`.
- [ ] Серверные данные — в TanStack Query, не в Zustand.
- [ ] Булевые переменные/параметры — через глагол (`isLoading`, `hasX`, `canY`). ESLint проверит.
- [ ] Никаких прямых вызовов `axios.get(...)` из компонента — только через сервис + query-хук.
