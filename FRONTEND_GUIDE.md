# TODO: Вот тут (и в других доках) очень палится ИИшка - очень много текста и подробностей. Подскажите, для чего вам этот документ, для работы агентов?

# FRONTEND_GUIDE — полный разбор фронта «Мой ИВМиИТ»

Учебно-справочный документ. Читается по порядку — даёт понимание того, **как устроен репозиторий**, **зачем каждый инструмент**, **какие архитектурные паттерны уже приняты** и **какие альтернативы есть**.

> Если надо краткий справочник «куда что класть» — смотри соседний [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md).
> Если надо концептуальный обзор в вики — [wiki/concepts/frontend-architecture.md](../wiki/concepts/frontend-architecture.md).
> **Этот файл — длинный разбор для первого знакомства и обучения.**

---

## Оглавление

- [Часть I. Технологический стек — зачем каждый инструмент](#часть-i-технологический-стек)
  - [1. Next.js 16 — фреймворк и роутинг](#1-nextjs-16)
  - [2. React 19 и TypeScript — база](#2-react-19-и-typescript)
  - [3. Material UI 6 — библиотека компонентов](#3-material-ui-6)
  - [4. SCSS Modules — локальные стили](#4-scss-modules)
  - [5. Zustand — клиентский стейт](#5-zustand)
  - [6. Axios — HTTP-клиент](#6-axios)
  - [7. TanStack Query — серверный стейт](#7-tanstack-query)
  - [8. React Hook Form — формы](#8-react-hook-form)
  - [9. ESLint — линтер](#9-eslint)
  - [10. Vitest — unit-тесты](#10-vitest)
  - [11. Playwright — e2e-тесты](#11-playwright)
- [Часть II. Файловая структура — каждый файл](#часть-ii-файловая-структура)
  - [Конфиги в корне](#конфиги-в-корне)
  - [src/app/ — роутинг](#srcapp--роутинг)
  - [src/components/ — компоненты](#srccomponents--компоненты)
  - [src/lib/api/ — сервисы](#srclibapi--сервисы)
  - [src/lib/hooks/ — query-хуки](#srclibhooks--query-хуки)
  - [src/lib/utils/ — утилиты](#srclibutils--утилиты)
  - [src/providers/ — провайдеры](#srcproviders--провайдеры)
  - [src/stores/ — Zustand](#srcstores--zustand)
  - [src/styles/ — дизайн-токены](#srcstyles--дизайн-токены)
  - [src/types/ — типы](#srctypes--типы)
  - [src/tests/ и tests/e2e/ — тесты](#srctests-и-testse2e--тесты)
  - [src/proxy.ts — middleware (с багом)](#srcproxyts--middleware-с-багом)
- [Часть III. Архитектурные паттерны](#часть-iii-архитектурные-паттерны)
- [Часть IV. Альтернативные архитектуры](#часть-iv-альтернативные-архитектуры)
- [Часть V. Что делать дальше](#часть-v-что-делать-дальше)

---

# Часть I. Технологический стек

Каждый раздел разбирает один инструмент по одному шаблону: **что это → зачем → где живёт → как работает → как использовать в проекте**.

## 1. Next.js 16

### Что это

**Next.js** — фреймворк над React, разработанный компанией Vercel. Он берёт на себя вещи, которые в голом React приходится настраивать руками:

- роутинг (какой URL → какой компонент),
- сборку (webpack/Turbopack),
- серверный рендеринг (SSR) и генерацию статики (SSG),
- API-роуты (бэкенд прямо внутри фронта),
- оптимизацию изображений, шрифтов, скриптов.

**Версия в проекте:** `16.2.4` — самая свежая на момент апреля 2026.

### App Router vs Pages Router

В Next.js есть **два поколения роутинга**. Важно их не путать, потому что интернет-гайды бывают старые:

- **Pages Router** — старый (живёт в `pages/`). Каждый файл = страница. Компоненты по умолчанию клиентские.
- **App Router** — новый (живёт в `app/`), стал дефолтом с v13. **У нас используется он.** Компоненты по умолчанию серверные, пока явно не пометить `'use client'`.

Наш проект — чистый App Router: есть только `src/app/`, `pages/` отсутствует.

### Как работает App Router — ключевые концепции

**1. Папки = URL-сегменты.**
```
src/app/
├── page.tsx                         → "/"
├── login/
│   └── page.tsx                     → "/login"
└── student/
    └── schedule/
        └── page.tsx                 → "/student/schedule"
```

**2. Специальные файлы** в каждом сегменте:
- `page.tsx` — сама страница (обязательный).
- `layout.tsx` — обёртка для страницы и всех вложенных роутов. Не перерендеривается при навигации внутри.
- `loading.tsx` — скелетон, пока данные грузятся.
- `error.tsx` — фоллбэк при ошибке рендера.
- `not-found.tsx` — 404 для этого сегмента.

**3. Route groups** — папки в скобках `(auth)`, `(dashboard)`. Они **НЕ влияют на URL**, но позволяют дать разным областям приложения разный `layout.tsx`. У нас:
- `(auth)/login` → URL `/login`, свой layout (без sidebar).
- `(dashboard)/student/schedule` → URL `/student/schedule`, свой layout (с sidebar и хедером).

**4. Динамические сегменты** — папка `[id]`. В компонент приходит `params.id`.
```
src/app/teacher/lesson/[id]/page.tsx  → "/teacher/lesson/42"
```

**5. Server Components по умолчанию.** Это компоненты, которые:
- рендерятся на сервере (или на этапе сборки),
- НЕ имеют доступа к `useState`, `useEffect`, браузерным API,
- результат приходит в браузер как HTML.
- Плюс: меньше JS на клиенте, быстрее первый рендер, безопаснее (секреты не утекают).
- Минус: нельзя интерактив.

**6. Client Components** — если нужны хуки, состояние, события, MUI, Zustand и т.д. — первая строка файла: `'use client';`. Компонент рендерится и на сервере (для HTML), и в браузере (для интерактива).

Правило для нашего проекта: **большинство страниц и компонентов клиентские**, потому что везде MUI/Query/Zustand. Серверные компоненты пока используем для тривиальных случаев (статика без стейта).

### Где настраивается Next.js

[next.config.ts](./next.config.ts) — минимальный конфиг:
```ts
const nextConfig: NextConfig = {
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],  // подавить варнинги старого Sass API
  },
};
```

### Next.js-специфичные утилиты, которые мы используем

- **`next/font/google`** — загружает Google Fonts на этапе сборки, хостит локально. Без рантайм-запросов к Google. См. [src/app/layout.tsx](./src/app/layout.tsx) — шрифты Manrope и IBM Plex Sans.
- **`next/link`** — навигация без перезагрузки страницы. Предзагружает следующую страницу при hover.
- **`next/navigation`** — хуки для клиентских компонентов: `usePathname()`, `useRouter()`, `useSearchParams()`.
- **`next/image`** — оптимизация картинок (мы пока не используем, но пригодится).

---

## 2. React 19 и TypeScript

**React 19** — UI-библиотека. В нашем проекте используется как движок для рендера компонентов. Ключевые вещи 19-й версии, которые могут встретиться:
- новый хук `use()` для чтения промисов и контекста,
- Server Actions (серверные функции вызываются с фронта без API-роута),
- Suspense + streaming.

Пока мы это не эксплуатируем активно — проект стандартный клиентский.

**TypeScript** — типизированный JavaScript. Вместо `const name = 'Иван'` пишем `const name: string = 'Иван'`, компилятор ругается, если типы не сходятся.

**Конфиг** [tsconfig.json](./tsconfig.json):
- `strict: true` — строгий режим (нельзя `any`, нельзя `null`-поля без пометки).
- `jsx: react-jsx` — поддержка JSX.
- **`paths: { "@/*": ["./src/*"] }`** — алиас. Вместо `import { foo } from '../../../lib/utils'` пишем `import { foo } from '@/lib/utils'`. Тот же алиас прописан в `vitest.config.ts`, чтобы тесты тоже понимали пути.

---

## 3. Material UI 6

### Что это

**Material UI (MUI)** — библиотека React-компонентов, реализующая Google Material Design. В ней есть готовые кнопки, инпуты, селекты, таблицы, диалоги, меню — с доступностью (ARIA, клавиатура), локализацией, темизацией.

**Версия:** `^6.4.0`. Есть также 7-я, но 6-я стабильная, с ней работаем.

### Зачем

Чтобы не делать `<div onClick={...}>` вместо кнопки. MUI даёт:
- семантически правильный HTML (`<button>` с правильными ARIA-атрибутами),
- keyboard navigation (Tab, Enter, Escape),
- ripple-эффект нажатия,
- адаптивность,
- цветовую тему.

### Ключевые компоненты, которые будем использовать

- `<Button>`, `<IconButton>` — кнопки.
- `<TextField>` — инпут (есть `variant="outlined" | "filled" | "standard"`).
- `<Select>`, `<MenuItem>` — выпадающий список.
- `<Checkbox>`, `<Radio>`, `<Switch>` — переключатели.
- `<Dialog>` — модальное окно.
- `<Card>`, `<CardContent>`, `<CardActions>` — карточки.
- `<Chip>` — бейдж («ЭКЗАМЕН», «ЗАЧЁТ»).
- `<Table>` — таблица с сортировкой (для рейтинга и журнала).
- `<CircularProgress>`, `<LinearProgress>` — спиннеры.
- `<Alert>` — уведомление об ошибке/успехе.
- `<Snackbar>` — всплывающий тост.
- `<Stack>`, `<Grid>`, `<Box>` — layout-примитивы (но для сложной вёрстки всё равно используем SCSS Modules).

### Тема

Живёт в [src/providers/ThemeProvider.tsx](./src/providers/ThemeProvider.tsx). Там прописана:
- **палитра** (primary `#2a657e` — из Figma, фон `#f8f9fa`, текст `#2b3437`),
- **шрифты** через `var(--font-ibm-plex-sans)` и `var(--font-manrope)`,
- **borderRadius** 8px,
- **overrides** для конкретных компонентов (например, `MuiButton.textTransform: 'none'` — чтобы кнопки не были CAPS).

**Инвариант:** значения в MUI-теме и в [src/styles/_variables.scss](./src/styles/_variables.scss) должны **совпадать по хексам**. Если меняешь primary — меняй в обоих местах, иначе MUI-кнопки и SCSS-блоки разъедутся по оттенку.

### Способы кастомизации MUI (от глобального к локальному)

1. **`theme.components.MuiButton.defaultProps`** — дефолтные пропсы для всех кнопок проекта.
2. **`theme.components.MuiButton.styleOverrides`** — глобальная перекраска всех кнопок.
3. **`sx={{ ... }}`** — одноразовая правка на конкретной кнопке: `<Button sx={{ mt: 2 }}>`. Удобно для мелких корректировок.
4. **`className={styles.customBtn}`** — класс из SCSS Module, когда стилей много или они переиспользуются.

**Правило проекта:** прежде чем писать обёртку над MUI-компонентом или переопределять его глобально — обсудить с командой. Часто задача решается через `sx` или локальный `.module.scss`. См. [wiki/concepts/frontend-architecture.md](../wiki/concepts/frontend-architecture.md) → «Правило переопределения MUI».

### `AppRouterCacheProvider`

В App Router нужен специальный провайдер от MUI, чтобы стили (они через Emotion) корректно попадали в SSR-HTML. Он уже подключён в [src/app/layout.tsx](./src/app/layout.tsx) — ничего делать не надо, просто помни, что он там.

---

## 4. SCSS Modules

### Что это

**SCSS** (Sass) — препроцессор CSS с переменными, вложенностью, миксинами, функциями.

**Modules** — способ изолировать стили по файлам: один `Foo.module.scss` виден только в `Foo.tsx`, классы получают уникальные имена автоматически.

Вместе: пишем локальные стили с переменными и миксинами, без конфликтов имён.

### Как работает

```tsx
// Foo.tsx
import styles from './Foo.module.scss';

export function Foo() {
  return <div className={styles.root}>Hello</div>;
}
```

```scss
// Foo.module.scss
@use '@/styles/variables' as *;

.root {
  background: $color-bg;
  padding: $spacing-lg;
}
```

В собранном HTML будет что-то вроде `<div class="Foo_root__a3f9k">`. Имя уникальное — не перекроет стили из другого компонента.

### Глобальные токены

Все цвета, отступы, радиусы, тени живут в [src/styles/_variables.scss](./src/styles/_variables.scss). Подключаются через:
```scss
@use '@/styles/variables' as *;
```

Аналогично [src/styles/_mixins.scss](./src/styles/_mixins.scss) — готовые миксины:
```scss
@use '@/styles/mixins' as *;

.root {
  @include flex-center;        // display: flex; align-items: center; justify-content: center;
  @include mobile {            // @media (max-width: 480px) { ... }
    padding: $spacing-sm;
  }
}
```

### Правила в проекте

1. **Никогда** не пишем хекс цвета в `.module.scss` — только через `$color-*` переменную.
2. **Один компонент** = **один модуль** рядом (`Foo.tsx` + `Foo.module.scss`).
3. Глобальные стили (reset, базовая типографика) — только в [src/app/globals.scss](./src/app/globals.scss), подключается один раз в корневом `layout.tsx`.
4. `inline-style` (`<div style={{...}}>`) — только для динамических значений (`style={{ backgroundColor: props.color }}`), не для статики.

### Когда MUI, когда SCSS Module

| Задача | Инструмент |
|---|---|
| Кнопка, инпут, чекбокс, селект, меню, модалка, таблица | **MUI** |
| Сетка страницы, расположение карточек, hero-блок, sidebar | **SCSS Module** |
| Карточка со своим дизайном (см. `SubjectCard` из Figma) | **SCSS Module** (обёртка, отступы), внутри — **MUI** для иконок/бейджей |
| Форма логина | **MUI** `<TextField>`, **SCSS Module** для layout формы и декоративного фона |

Правило: «Сначала ищу в MUI. Если есть — беру. Если нет или хочется что-то своё — через SCSS Module.»

---

## 5. Zustand

### Что это

**Zustand** — минималистичная библиотека для клиентского состояния. Альтернатива Redux/MobX/Recoil.

- Одна функция `create()` создаёт стор.
- Нет провайдеров, нет редьюсеров, нет экшенов — просто функции.
- ~1 КБ в gzip.

### Зачем

Для **клиентского** состояния (UI-флаги, авторизованный пользователь, настройки). НЕ для данных, которые приходят с сервера — для них TanStack Query.

### Как работает

```ts
// src/stores/useUiStore.ts
import { create } from 'zustand';

interface UiState {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
}));
```

```tsx
// Использование в компоненте
function Header() {
  const isOpen = useUiStore((s) => s.isSidebarOpen);
  const toggle = useUiStore((s) => s.toggleSidebar);
  return <button onClick={toggle}>{isOpen ? 'Закрыть' : 'Открыть'}</button>;
}
```

**Селектор `(s) => s.isSidebarOpen`** — оптимизация: компонент перерендерится только когда изменится именно это поле, а не весь стор.

### Middleware `persist`

Для данных, которые должны пережить перезагрузку страницы — оборачиваем в `persist`:
```ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({ user: null, setUser: (u) => set({ user: u }) }),
    { name: 'auth-storage' }  // ключ в localStorage
  )
);
```

> ⚠️ **Сейчас `useAuthStore` хранит токен в localStorage** — это уязвимо к XSS. План перехода на HttpOnly-cookies — [wiki/concepts/auth-strategy.md](../wiki/concepts/auth-strategy.md). Ждём реализации на бэке.

### Существующие сторы

- [src/stores/useAuthStore.ts](./src/stores/useAuthStore.ts) — `user`, `accessToken`, `refreshToken`, `isAuthenticated`.
- [src/stores/useUiStore.ts](./src/stores/useUiStore.ts) — `isSidebarOpen`.
- [src/stores/useNotificationStore.ts](./src/stores/useNotificationStore.ts) — `unreadCount`.

### Правила

- **Серверные данные в Zustand не класть.** Списки предметов, расписание, оценки — всё это зона TanStack Query.
- **Один стор = одна ответственность.** Не мешаем auth и UI в одном сторе.
- **Именование булевых** — через глагол (`isLoading`, `hasPermission`). Линтер проверяет.

---

## 6. Axios

### Что это

**Axios** — HTTP-клиент для браузера и Node. Как `fetch`, но удобнее: автоматический JSON, интерсепторы, отмена запросов, таймауты.

### Зачем именно axios, а не fetch

- Короче код для JSON: `api.get('/users')` вместо `fetch().then(r => r.json())`.
- **Интерсепторы** — глобальный перехват запросов и ответов (подставить токен, обработать 401).
- Поддержка старых браузеров (нам не критично, но полезно).

### Где в проекте

**Инстанс:** [src/lib/api/axios.ts](./src/lib/api/axios.ts) — один на весь проект. Настроен с:
- `baseURL: process.env.NEXT_PUBLIC_API_URL` (берётся из `.env.local`).
- **Request-интерсептор** — подставляет `Authorization: Bearer <token>` из Zustand-стора (удалим после перехода на HttpOnly).
- **Response-интерсептор** — при 401 вызывает `logout()` + редиректит на `/login`.

**Сервисы** — файлы `src/lib/api/<feature>.api.ts` (auth, subjects, grades и т.д.). Каждая функция — тонкая обёртка:
```ts
export const getSubjects = () =>
  api.get<ApiResponse<Subject[]>>('/subjects');
```

Возвращают **сырой `AxiosResponse`**. Распаковку делает query-хук (см. ниже).

### Правило

**Компонент никогда не вызывает axios напрямую.** Он зовёт query-хук → хук зовёт сервис → сервис зовёт axios. Три слоя.

---

## 7. TanStack Query

### Что это

**TanStack Query** (бывший React Query) — библиотека для управления **серверным состоянием**: данными, которые приходят с API.

На неё возлагается:
- запрос данных (через axios или fetch),
- **кэширование** (не перезапрашивать одно и то же),
- **рефетч** при фокусе окна, при интервале, при мутации,
- отслеживание `isLoading`, `isError`, `data`,
- **инвалидация** — пометить кэш «протух», перезапросить.

### Зачем отдельная библиотека

В голом React все эти вещи приходится делать руками через `useState` + `useEffect`. Получается бойлерплейт, баги с race condition, забываешь инвалидировать кэш. TanStack Query решает это одной абстракцией — `useQuery` / `useMutation`.

### Как работает

**Запрос (query):**
```ts
// src/lib/hooks/useSubjects.ts
'use client';
import { useQuery } from '@tanstack/react-query';
import { getSubjects } from '@/lib/api/subjects.api';

export function useSubjects() {
  return useQuery({
    queryKey: ['subjects'],                              // уникальный ID в кэше
    queryFn: () => getSubjects().then(r => r.data.data), // функция получения
  });
}
```

В компоненте:
```tsx
function SubjectsList() {
  const { data, isLoading, error } = useSubjects();

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error.message}</Alert>;
  return <ul>{data?.map(s => <li key={s.id}>{s.name}</li>)}</ul>;
}
```

**Мутация (mutation) — когда что-то отправляем на сервер:**
```ts
export function useSetGrades() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: SetGradePayload[]) => setGrades(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['gradebook'] });  // перезапросить журнал
      qc.invalidateQueries({ queryKey: ['grades'] });     // перезапросить оценки
    },
  });
}
```

### Ключевые паттерны в проекте

**queryKey как иерархия:**
```ts
['subjects']               // список всех предметов
['subjects', id]           // конкретный предмет
['subjects', 'detail', id] // детальная инфа
['gradebook', subjectId, groupId]  // журнал
```

Инвалидация `['subjects']` перезапросит и `['subjects']`, и `['subjects', id]` — префиксный матчинг.

**Зависимый запрос:**
```ts
useQuery({
  queryKey: ['subject', id],
  queryFn: () => getSubjectById(id).then(r => r.data.data),
  enabled: !!id,  // не запускать, пока id не определён
});
```

**Поллинг** (регулярный перезапрос):
```ts
useQuery({
  queryKey: ['notifications', 'unread-count'],
  queryFn: () => getUnreadCount().then(r => r.data.data),
  refetchInterval: 30_000,  // каждые 30 секунд
});
```

**Конверт API:** бэк у нас всегда отвечает `{ data: T, message? }`. Отсюда двойная распаковка:
```ts
queryFn: () => getSubjects().then(r => r.data.data)
//                             ^ axios  ^ конверт бэка
```

### QueryClient дефолты

[src/providers/QueryProvider.tsx](./src/providers/QueryProvider.tsx):
```ts
defaultOptions: {
  queries: {
    refetchOnWindowFocus: false,  // не перезапрашивать при переключении вкладок
    retry: 1,                      // 1 повтор при ошибке
    staleTime: 5 * 60 * 1000,      // 5 мин данные считаются свежими
  },
}
```

`staleTime: 5 мин` означает: если страница была открыта 2 минуты назад, данные всё ещё «свежие» — повторный render не триггерит fetch. После 5 минут — запрос уйдёт заново.

### Три слоя API в проекте

```
types/<f>.ts          →  lib/api/<f>.api.ts  →  lib/hooks/use<F>.ts  →  component
(интерфейсы)            (axios-сервис)          (query-хук, кэш)        (рендер)
```

Компонент **никогда** не обращается к axios или API напрямую — только через хук. Хук знает про кэш, loading, error — компонент просто получает готовый `{ data, isLoading }`.

---

## 8. React Hook Form

### Что это

**React Hook Form (RHF)** — библиотека для форм. Альтернатива Formik. Лёгкая, с хорошей производительностью (мало перерендеров).

**Статус:** пакет установлен (`react-hook-form@^7.72.1`), но **в текущем коде не используется**. Первое реальное применение — форма логина.

### Зачем

Формы в React без библиотеки — это `useState` на каждое поле, `onChange`-хендлеры, валидация руками. С RHF всё сводится к:
```tsx
const { control, handleSubmit } = useForm();
```

Плюс MUI-компоненты (`<TextField>`) требуют обёртки через `<Controller>` — без этого RHF не видит изменений.

### Паттерн с MUI

```tsx
'use client';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button } from '@mui/material';

interface LoginForm {
  login: string;
  password: string;
}

export function LoginForm() {
  const { control, handleSubmit } = useForm<LoginForm>({
    defaultValues: { login: '', password: '' },
  });

  const onSubmit = (data: LoginForm) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="login"
        control={control}
        rules={{ required: 'Введите логин' }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Логин"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{ required: 'Введите пароль', minLength: { value: 6, message: 'Минимум 6 символов' } }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            type="password"
            label="Пароль"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />

      <Button type="submit" variant="contained">Войти</Button>
    </form>
  );
}
```

### Валидация

Встроена в RHF через проп `rules`. Можно подключить **Zod** + `@hookform/resolvers` для декларативной валидации:
```ts
const schema = z.object({
  login: z.string().min(1, 'Введите логин'),
  password: z.string().min(6, 'Минимум 6 символов'),
});
const { control } = useForm({ resolver: zodResolver(schema) });
```

**Zod пока не установлен.** На простые формы хватит `rules`, на сложные (с зависимостями между полями) — поставим zod.

### Правило

Форма = RHF + MUI-инпуты через `<Controller>` + сабмит через `handleSubmit`. Никаких `useState` на каждое поле.

---

## 9. ESLint

### Что это

**ESLint** — статический анализатор JS/TS. Проверяет код на потенциальные баги и стилевые проблемы до запуска.

### Конфиг

[eslint.config.mjs](./eslint.config.mjs) — **flat config** (новый формат ESLint 9):
```js
export default defineConfig([
  ...nextVitals,         // правила Next.js + core web vitals
  ...nextTypeScript,     // правила TypeScript
  {
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'variable', types: ['boolean'], format: ['PascalCase'], prefix: ['is', 'has', 'can', 'should', 'will', 'did'] },
        { selector: 'parameter', types: ['boolean'], format: ['PascalCase'], prefix: [...] },
      ],
    },
  },
]);
```

**Что даёт:**
- правила Next.js (оптимизация картинок, серверные/клиентские компоненты),
- правила TS (неиспользуемые импорты, `any`, неправильные типы),
- **наше правило** — булевые переменные должны начинаться с `is/has/can/...` (из ревью Дмитрия).

### Как запускать

```bash
npm run lint       # проверить весь проект
npm run lint -- --fix  # автоисправить что можно
```

### В CI

В [.github/workflows/frontend-ci.yml](./.github/workflows/frontend-ci.yml) шаг `npm run lint` запускается на каждый PR. Красный ESLint = мерж заблокирован.

### Что НЕ настроено

- **Prettier** — форматировщик. Можно поставить для единого стиля (отступы, кавычки). Пока договорились вручную.
- **Husky + lint-staged** — чтобы ESLint запускался автоматически в pre-commit. Не настроено — легко добавить позже.

---

## 10. Vitest

### Что это

**Vitest** — тест-раннер для unit-тестов (как Jest, но для Vite и совместим с модулями ES). Быстрый, TypeScript из коробки.

### Конфиг

[vitest.config.ts](./vitest.config.ts):
```ts
test: {
  environment: 'jsdom',                        // эмуляция браузера для React-тестов
  globals: true,                                // не импортировать describe/it/expect
  setupFiles: ['./src/tests/setup.ts'],         // загружается перед тестами
  include: ['src/**/*.{test,spec}.{ts,tsx}'],   // паттерн поиска тестов
  passWithNoTests: true,                         // пустой прогон не валит CI
  css: false,                                    // не парсим CSS при тестах
}
```

### Что тестируем

Unit-тесты — **небольшие куски логики**:
- утилиты (`cn`, `formatDate`, `exportCsv`),
- хуки (как они ведут себя при определённых данных),
- компоненты (рендерят ли нужный текст, реагируют ли на клик),
- Zustand-сторы (`toggleSidebar` меняет состояние).

**НЕ тестируем** настоящий API — это уже e2e.

### Где живут тесты

**Колокация** — рядом с исходником:
```
src/components/SubjectCard/
├── SubjectCard.tsx
├── SubjectCard.module.scss
└── SubjectCard.test.tsx   ← тут
```

Плюс подход: тест находится рядом с компонентом, легко найти, не забываешь обновить.

### Как писать тест

```tsx
// src/components/shared/SubjectCard/SubjectCard.test.tsx
import { render, screen } from '@testing-library/react';
import { SubjectCard } from './SubjectCard';

test('рендерит название предмета', () => {
  render(<SubjectCard name="Базы данных" groups="09-351" />);
  expect(screen.getByText('Базы данных')).toBeInTheDocument();
});

test('при клике вызывает callback', async () => {
  const onClick = vi.fn();
  render(<SubjectCard name="Х" groups="Y" onClick={onClick} />);
  await screen.getByRole('button').click();
  expect(onClick).toHaveBeenCalled();
});
```

### Setup-файл

[src/tests/setup.ts](./src/tests/setup.ts):
```ts
import '@testing-library/jest-dom';
```

Подключает расширенные матчеры: `toBeInTheDocument()`, `toHaveClass()`, `toBeDisabled()` и т.д.

### Запуск

```bash
npm test              # watch-режим, перезапускает при изменении
npm run test:ui       # UI-режим в браузере (удобно, но может тормозить)
```

### Что есть и чего нет

- Инфраструктура настроена: `@testing-library/react`, `@testing-library/jest-dom`, `jsdom`, `vitest`.
- **Самих тестов нет** — ни одного `*.test.tsx`. Писать по мере появления логики.

---

## 11. Playwright

### Что это

**Playwright** — фреймворк для **end-to-end (e2e) тестов**. Запускает реальный браузер (Chromium), открывает приложение, кликает, заполняет формы, проверяет что всё работает как будто руками.

### Чем отличается от Vitest

| | Vitest | Playwright |
|---|---|---|
| Что тестирует | Отдельные функции / компоненты | Поведение всего приложения в браузере |
| Среда | jsdom (эмуляция) | Настоящий Chromium |
| Скорость | Миллисекунды | Секунды |
| API | мокаем | настоящий (либо stub) |

Обычно пирамида: много Vitest → меньше Playwright. Юнит-тесты гоняются на каждый коммит, e2e — при релизе или на PR.

### Конфиг

[playwright.config.ts](./playwright.config.ts):
```ts
testDir: './tests/e2e',
use: {
  baseURL: 'http://localhost:3000',
  trace: 'on-first-retry',                // делать запись экрана при первой ошибке
},
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
],
webServer: {
  command: 'npm run dev',                   // автоматически поднять dev-сервер
  url: 'http://localhost:3000',
  reuseExistingServer: !process.env.CI,
},
```

### Где живут тесты

[tests/e2e/](./tests/e2e/) в корне проекта — НЕ в `src/`.
- [auth.spec.ts](./tests/e2e/auth.spec.ts) — сценарии логина.
- [student-schedule.spec.ts](./tests/e2e/student-schedule.spec.ts) — расписание студента.
- [teacher-gradebook.spec.ts](./tests/e2e/teacher-gradebook.spec.ts) — журнал преподавателя.

### Как писать тест

```ts
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('форма логина отображается', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Мой ИВМИиТ' })).toBeVisible();
  await expect(page.getByLabel('Логин')).toBeVisible();
  await expect(page.getByLabel('Пароль')).toBeVisible();
});

test('успешный вход редиректит на /student/schedule', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Логин').fill('ivanov.i');
  await page.getByLabel('Пароль').fill('secret');
  await page.getByRole('button', { name: 'ВОЙТИ' }).click();
  await expect(page).toHaveURL('/student/schedule');
});
```

### Запуск

```bash
npm run test:e2e       # все e2e, headless
npm run test:e2e:ui    # UI-режим Playwright (видишь, что делает)
```

Перед первым запуском нужен `npx playwright install chromium` — скачать браузер.

### В CI

**В CI сейчас не запускаются.** CI гоняет только lint + Vitest + build. E2E — локально или в отдельном job позже.

Почему: e2e требуют реальный браузер + dev-сервер, это медленно и менее стабильно, чем unit-тесты.

### Текущее состояние

В `tests/e2e/` лежат **скелетоны** — тесты написаны, но требуют инжекции JWT-токена для защищённых страниц (пока бэк не готов — нет login-flow). В файлах есть `beforeEach` с TODO.

---

# Часть II. Файловая структура

Теперь разберём **каждый файл** репозитория. Формат: **путь → назначение → что внутри → статус**.

## Конфиги в корне

### [package.json](./package.json)
**Назначение:** манифест npm-пакета. Описывает зависимости, скрипты, метаданные.
**Ключевые поля:**
- `"name": "moi-ivmiit-front"`, `"version": "0.1.0"`
- `"scripts"`: `dev`, `build`, `start`, `lint`, `test`, `test:ui`, `test:e2e`, `test:e2e:ui`
- `"dependencies"`: рантайм (React, Next, MUI, Zustand, axios, query, react-hook-form)
- `"devDependencies"`: dev-инструменты (TypeScript, ESLint, Vitest, Playwright, Testing Library, Sass)

### [package-lock.json](./package-lock.json)
**Назначение:** точные версии всего дерева зависимостей. Генерируется npm автоматически. **Не редактируется руками.** Коммитится.

### [tsconfig.json](./tsconfig.json)
**Назначение:** настройки TypeScript.
**Ключевые:**
- `"strict": true` — строгий режим.
- `"paths": { "@/*": ["./src/*"] }` — алиас `@`.
- `"jsx": "preserve"` — JSX оставляет Next для Babel.
- `"target": "ES2017"` — компилируем в ES2017 (поддержка старых браузеров).

### [next-env.d.ts](./next-env.d.ts)
**Назначение:** автоматически сгенерированный Next.js файл с TS-типами для Next-утилит. **Не редактируется.**

### [next.config.ts](./next.config.ts)
**Назначение:** конфиг Next.js.
**Внутри:** включена SCSS, подавлены deprecation-варнинги старого Sass API.

### [eslint.config.mjs](./eslint.config.mjs)
**Назначение:** правила ESLint (flat config).
**Внутри:** `eslint-config-next/core-web-vitals`, `eslint-config-next/typescript`, + кастомное правило `@typescript-eslint/naming-convention` для булевых переменных.

### [vitest.config.ts](./vitest.config.ts)
**Назначение:** конфиг Vitest (unit-тесты).
**Внутри:** `environment: jsdom`, алиас `@`, setup-файл, паттерн тестов `src/**/*.{test,spec}.{ts,tsx}`.

### [playwright.config.ts](./playwright.config.ts)
**Назначение:** конфиг Playwright (e2e).
**Внутри:** testDir `./tests/e2e`, baseURL `http://localhost:3000`, автозапуск dev-сервера, только Chromium.

### [.github/workflows/frontend-ci.yml](./.github/workflows/frontend-ci.yml)
**Назначение:** GitHub Actions pipeline.
**Внутри:** триггеры — push в main/develop/feat/fix/chore, PR в main/develop. Шаги: checkout → Node 20 → `npm ci` → `npm run lint` → `npm test` → `npm run build`. Есть проверка «проект инициализирован» (чтобы пустой репо не валил CI).

### [README.md](./README.md)
Стандартный README от Next.js-стартера (не особо информативный). Можно переписать позже.

### [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
**Назначение:** краткий справочник для разработчиков «куда что класть». Написан ранее. Комплементарен этому FRONTEND_GUIDE.md (гайд — длинный обучающий, overview — короткий справочник).

### [API_GUIDE.md](./API_GUIDE.md)
**Назначение:** контракт фронт-бэк (эндпоинты, формат ответов, авторизация). Читать перед работой с API.

### [.gitignore](./.gitignore)
Что не коммитим: `node_modules`, `.next`, `.env.local`, отчёты тестов.

---

## src/app/ — роутинг

Корень App Router. Каждая папка = URL-сегмент. См. раздел [Next.js 16](#1-nextjs-16).

### [src/app/layout.tsx](./src/app/layout.tsx)
**Назначение:** корневой layout всего приложения. Оборачивает любую страницу.
**Внутри:**
- загрузка шрифтов Manrope + IBM Plex Sans через `next/font/google` как CSS-переменные,
- `<html lang="ru">`,
- `<AppRouterCacheProvider>` (MUI SSR-cache),
- `<Providers>` (`QueryProvider` + `ThemeProvider`),
- метаданные (`title`, `description`).

Этот файл — ВХОДНАЯ ТОЧКА всего проекта.

### [src/app/page.tsx](./src/app/page.tsx)
**Назначение:** главная страница (`/`).
**Статус:** реализована (демонстрационная). Показывает статус стека и демо React Query + Zustand. После реализации auth её, скорее всего, заменим на редирект в `/login` или `/<role>/schedule`.

### [src/app/globals.scss](./src/app/globals.scss)
**Назначение:** глобальные стили. Подключается один раз из корневого `layout.tsx`.
**Внутри:** reset (`box-sizing`, `margin: 0`), базовая типографика, сглаживание шрифтов.

### [src/app/not-found.tsx](./src/app/not-found.tsx)
**Назначение:** страница 404. Показывается при попадании на несуществующий URL.
**Статус:** ЗАГЛУШКА (`return null`). Нужно реализовать.

### [src/app/(auth)/](./src/app/(auth)/)
Route group «авторизация» — без sidebar/header.

- **[(auth)/layout.tsx](./src/app/(auth)/layout.tsx)** — layout для форм логина. Сейчас passthrough.
- **[(auth)/login/page.tsx](./src/app/(auth)/login/page.tsx)** — страница `/login`. **ЗАГЛУШКА.** Верстается по Figma + React Hook Form.
- **[(auth)/login/login.module.scss](./src/app/(auth)/login/login.module.scss)** — пустой модуль.

### [src/app/(dashboard)/](./src/app/(dashboard)/)
Route group «кабинет» — с header/sidebar.

- **[(dashboard)/layout.tsx](./src/app/(dashboard)/layout.tsx)** — сейчас passthrough. Здесь будет `<Header/>` + `<Sidebar/>` + `<PageContainer>{children}</PageContainer>`.

#### Студент
- `(dashboard)/student/schedule/page.tsx` — `/student/schedule` (главная студента).
- `(dashboard)/student/subjects/page.tsx` — `/student/subjects`.
- `(dashboard)/student/subjects/[id]/page.tsx` — `/student/subjects/42` (детальная).
- `(dashboard)/student/rating/page.tsx` — `/student/rating`.
- `(dashboard)/student/notifications/page.tsx` — `/student/notifications`.
- `(dashboard)/student/profile/page.tsx` — `/student/profile`.

**Все — заглушки.**

#### Преподаватель
- `(dashboard)/teacher/schedule/page.tsx` — `/teacher/schedule` (главная препода).
- `(dashboard)/teacher/subjects/page.tsx` — `/teacher/subjects`.
- `(dashboard)/teacher/subjects/[subjectId]/gradebook/[groupId]/page.tsx` — журнал группы.
- `(dashboard)/teacher/lesson/[id]/page.tsx` — страница пары.
- `(dashboard)/teacher/notifications/page.tsx` — `/teacher/notifications`.
- `(dashboard)/teacher/profile/page.tsx` — `/teacher/profile`.

**Все — заглушки.**

---

## src/components/ — компоненты

### layout/
Каркасные элементы страницы. **Все — заглушки.**

- **[layout/Header/Header.tsx](./src/components/layout/Header/Header.tsx)** — шапка сайта (логотип, навигация, профиль). Будет использоваться в dashboard layout.
- **[layout/Sidebar/Sidebar.tsx](./src/components/layout/Sidebar/Sidebar.tsx)** — боковое меню. Состояние свёрнут/развёрнут — в `useUiStore`.
- **[layout/PageContainer/PageContainer.tsx](./src/components/layout/PageContainer/PageContainer.tsx)** — обёртка контента (max-width, padding). Возможно, не понадобится — layout можно делать прямо в `(dashboard)/layout.tsx`.

### shared/
Доменные компоненты (связанные с предметной областью). **Все — заглушки.**

- **[shared/SubjectCard/SubjectCard.tsx](./src/components/shared/SubjectCard/SubjectCard.tsx)** — карточка предмета на дашборде преподавателя (иконка, название, бейдж «ЭКЗАМЕН», группы).
- **[shared/ScheduleGrid/ScheduleGrid.tsx](./src/components/shared/ScheduleGrid/ScheduleGrid.tsx)** — сетка расписания (день/неделя).
- **[shared/RatingTable/RatingTable.tsx](./src/components/shared/RatingTable/RatingTable.tsx)** — таблица рейтинга.
- **[shared/NotificationItem/NotificationItem.tsx](./src/components/shared/NotificationItem/NotificationItem.tsx)** — одно уведомление в списке.

### stack-check/
**[stack-check/StackCheckClient.tsx](./src/components/stack-check/StackCheckClient.tsx)** — **единственный реализованный компонент.** Демо-страница проверки стека: кнопки, использующие Query, Zustand, MUI. Используется в корневом `page.tsx`. После реализации настоящих страниц можно удалить.

### ~~ui/~~
Папка **удалена** (апрель 2026) — была заглушками без кода. Решение: не плодим свои обёртки поверх MUI. Если в будущем появится **реальная** обёртка с логикой — создадим папку `ui/` осознанно. Документация — [wiki/concepts/frontend-architecture.md](../wiki/concepts/frontend-architecture.md).

---

## src/lib/api/ — сервисы

Каждый файл — набор функций, оборачивающих axios для одной предметной области. Возвращают сырой `AxiosResponse`.

### [axios.ts](./src/lib/api/axios.ts)
**Базовый инстанс.** Один на проект.
- `baseURL` из `process.env.NEXT_PUBLIC_API_URL`.
- Request-интерсептор: добавляет `Authorization: Bearer <token>`.
- Response-интерсептор: при 401 делает `logout()` + редирект на `/login`.
- Помечен `TODO(auth)` — после перехода на HttpOnly-cookies часть логики уйдёт.

### [auth.api.ts](./src/lib/api/auth.api.ts)
- `login(payload)` → `POST /auth/login`
- `logout()` → `POST /auth/logout`
- `refreshToken(token)` → `POST /auth/refresh`

### [subjects.api.ts](./src/lib/api/subjects.api.ts)
- `getSubjects()` → список предметов
- `getSubjectById(id)` → детальная инфа

### [schedule.api.ts](./src/lib/api/schedule.api.ts)
- `getScheduleByDate(date)` → расписание на день
- `getWeekSchedule(date)` → расписание на неделю

### [grades.api.ts](./src/lib/api/grades.api.ts)
- `getGradesBySubject(subjectId)` → оценки студента
- `getGradebook(subjectId, groupId)` → журнал группы (для препода)
- `setGrades(payload)` → выставить оценки

### [attendance.api.ts](./src/lib/api/attendance.api.ts)
- `getAttendanceByLesson(lessonId)` → посещаемость на паре
- `setAttendance(payload)` → выставить посещаемость

### [rating.api.ts](./src/lib/api/rating.api.ts)
- `getOverallRating()` → общий рейтинг
- `getSubjectRating(subjectId)` → рейтинг по предмету

### [notifications.api.ts](./src/lib/api/notifications.api.ts)
- `getNotifications(page)` → список (пагинация)
- `getUnreadCount()` → число непрочитанных
- `markAsRead(id)` → пометить прочитанным
- `sendNotification(payload)` → отправить группе (препод)

### [users.api.ts](./src/lib/api/users.api.ts)
- `getProfile()` → текущий пользователь (`/users/me`)
- `getStudentsByGroup(groupId)` → список студентов группы

---

## src/lib/hooks/ — query-хуки

Обёртки TanStack Query над сервисами. Все с `'use client'`. Возвращают `{ data, isLoading, error }` или `{ mutate, isPending }`.

- **[useAuth.ts](./src/lib/hooks/useAuth.ts)** — `login`, `logout` через `useMutation` + редирект по роли.
- **[useSubjects.ts](./src/lib/hooks/useSubjects.ts)** — `useSubjects()`, `useSubjectDetail(id)`.
- **[useSchedule.ts](./src/lib/hooks/useSchedule.ts)** — `useDaySchedule(date)`, `useWeekSchedule(date)`.
- **[useGrades.ts](./src/lib/hooks/useGrades.ts)** — `useGradesBySubject`, `useGradebook`, `useSetGrades` (с инвалидацией).
- **[useRating.ts](./src/lib/hooks/useRating.ts)** — `useOverallRating`, `useSubjectRating`.
- **[useNotifications.ts](./src/lib/hooks/useNotifications.ts)** — список, unread-count (с `refetchInterval: 30_000`), `markAsRead`, `sendNotification`.

**Файла `useAttendance.ts` пока нет** — добавим, когда понадобится.

---

## src/lib/utils/ — утилиты

Вспомогательные функции без состояния. Покрываются unit-тестами.

### [cn.ts](./src/lib/utils/cn.ts)
Конкатенация CSS-классов с фильтрацией falsy. Аналог `clsx`.
```ts
cn(styles.btn, isActive && styles.active, disabled && 'disabled')
```

### [formatDate.ts](./src/lib/utils/formatDate.ts)
Форматирование дат на русском:
- `formatDateFull('2026-04-16')` → `"16 апреля 2026"`
- `formatDateShort(...)` → `"16 апр"`
- `formatDateWithDay(...)` → `"Среда, 16 апреля"`
- `getTodayISO()` → `"2026-04-16"`

### [exportCsv.ts](./src/lib/utils/exportCsv.ts)
Экспорт данных в CSV с UTF-8 BOM (чтобы Excel корректно открывал кириллицу). Использование — экспорт журнала группы.

---

## src/providers/ — провайдеры

### [Providers.tsx](./src/providers/Providers.tsx)
Композитор — оборачивает детей в `QueryProvider → ThemeProvider`. Используется в корневом `layout.tsx`.

### [QueryProvider.tsx](./src/providers/QueryProvider.tsx)
Обёртка `<QueryClientProvider>`. Создаёт `QueryClient` с проектными дефолтами (`staleTime: 5 мин`, `retry: 1`, `refetchOnWindowFocus: false`).

### [ThemeProvider.tsx](./src/providers/ThemeProvider.tsx)
MUI-тема. Палитра, типографика, overrides компонентов, локаль `ruRU`. Значения **синхронизированы с `_variables.scss`**.

---

## src/stores/ — Zustand

### [useAuthStore.ts](./src/stores/useAuthStore.ts)
- Состояние: `user`, `accessToken`, `refreshToken`, `isAuthenticated`.
- Экшены: `setAuth`, `logout`, `setAccessToken`, `getRole`.
- Middleware: `persist` с ключом `'auth-storage'`.
- **TODO(auth):** переехать на HttpOnly — см. комментарий в файле и [wiki/concepts/auth-strategy.md](../wiki/concepts/auth-strategy.md).

### [useUiStore.ts](./src/stores/useUiStore.ts)
- Состояние: `isSidebarOpen` (default `true`).
- Экшены: `toggleSidebar`, `setSidebarOpen(isOpen)`.

### [useNotificationStore.ts](./src/stores/useNotificationStore.ts)
- Состояние: `unreadCount` (number).
- Экшены: `setUnreadCount`, `decrementUnread` (защищено от уйти в минус).

---

## src/styles/ — дизайн-токены

### [_variables.scss](./src/styles/_variables.scss)
Все токены: цвета (бренд, статусы, нейтральные), spacing (4px-база), радиусы, тени, transitions, breakpoints, layout (header-height, sidebar-width). **Ссылаемся через `@use` в других файлах.**

### [_typography.scss](./src/styles/_typography.scss)
Шрифты (`$font-family` = IBM Plex Sans, `$font-family-heading` = Manrope), размеры, веса, line-heights.

### [_mixins.scss](./src/styles/_mixins.scss)
Переиспользуемые миксины: `mobile`, `tablet`, `desktop`, `wide`, `flex-center`, `flex-between`, `flex-column`, `truncate`, `line-clamp($lines)`, `glass`, `card`.

---

## src/types/ — типы

Каждый файл — интерфейсы для одной предметной области.

- **[api.ts](./src/types/api.ts)** — `ApiResponse<T>` (конверт бэка), `PaginatedResponse<T>`, `ApiError`, `LoginPayload`, `LoginResponse`.
- **[user.ts](./src/types/user.ts)** — `Role`, `User`, `Student`, `Teacher`.
- **[subject.ts](./src/types/subject.ts)** — `Subject`, `SubjectDetail`.
- **[schedule.ts](./src/types/schedule.ts)** — `Lesson`, `ScheduleDay`, `ScheduleWeek`.
- **[grade.ts](./src/types/grade.ts)** — `Grade`, `GradebookRow`, `SetGradePayload`, `GradeEntry`.
- **[attendance.ts](./src/types/attendance.ts)** — `AttendanceMark`, `AttendanceRecord`, `SetAttendancePayload`.
- **[rating.ts](./src/types/rating.ts)** — `RatingEntry`, `SubjectRating`.
- **[notification.ts](./src/types/notification.ts)** — `NotificationType`, `Notification`, `SendNotificationPayload`.

**Замечание №5 Дмитрия** — генерить эти типы из Swagger автоматом. Отложено до готовности бэка.

---

## src/tests/ и tests/e2e/ — тесты

### [src/tests/setup.ts](./src/tests/setup.ts)
Сетап Vitest: подключает `@testing-library/jest-dom` для расширенных матчеров.

### tests/e2e/
**Внешняя папка** (не в `src/`), потому что Playwright — отдельная экосистема.

- **[tests/e2e/auth.spec.ts](./tests/e2e/auth.spec.ts)** — сценарии логина (скелетон).
- **[tests/e2e/student-schedule.spec.ts](./tests/e2e/student-schedule.spec.ts)** — расписание студента (с TODO на инжекцию токена).
- **[tests/e2e/teacher-gradebook.spec.ts](./tests/e2e/teacher-gradebook.spec.ts)** — журнал преподавателя (с TODO).

---

## src/proxy.ts — middleware (с багом)

**Внимание:** файл есть, но **не работает**. Two bugs:

1. Next.js-middleware должен называться **`middleware.ts`** (или **`src/middleware.ts`**), НЕ `proxy.ts`. С текущим именем Next его не подхватит.
2. Функция должна называться **`middleware`**, а не `proxy`.

Содержимое:
```ts
const protectedPaths = ['/student', '/teacher'];
const publicPaths = ['/login'];

export function proxy(request: NextRequest) {
  // логики нет, просто NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

Идея правильная — защищать роуты по роли на уровне middleware (до рендера страницы). Но файл нужно:
1. Переименовать в `middleware.ts`.
2. Переименовать функцию в `middleware`.
3. Добавить реальную проверку (после внедрения HttpOnly — читать куку и проверять).

Пока бэк не готов — оставляем как есть. Можно пометить `// FIXME:` в файле.

---

# Часть III. Архитектурные паттерны

Здесь — **решения**, которые действуют в проекте (и **почему**).

## 1. Трёхслойный API

**Паттерн:** `types → axios-сервис → query-хук → компонент`.

Компонент никогда не обращается к axios или API напрямую.

**Почему:**
- Компонент не знает про кэш, 401, таймауты — он просто получает `{ data, isLoading, error }`.
- Сервис можно протестировать изолированно.
- При миграции с axios на `fetch` (или на OpenAPI-generated client) меняется только сервис.

**Альтернатива, которую не выбрали:** писать `fetch` прямо в компоненте (как делают 90% туториалов). Минусы: дублирование, баги с race condition, нет кэша.

## 2. Разделение клиентского и серверного стейта

| Что | Где хранится |
|---|---|
| Залогинен ли пользователь, его ФИО и роль | **Zustand** (`useAuthStore`) |
| Открыт ли sidebar, режим темы | **Zustand** (`useUiStore`) |
| Счётчик непрочитанных уведомлений | **Zustand** (`useNotificationStore`) — синхронизируется с сервером |
| Список предметов, расписание, оценки, рейтинг | **TanStack Query** |

**Правило:** данные, которые приходят с сервера, **НЕ кладём в Zustand**. Это зона Query. Иначе потеряем кэш, инвалидацию, рефетч — всё, за что Query и нужен.

## 3. Design Tokens — один источник истины

Цвета, отступы, радиусы живут **только** в [src/styles/_variables.scss](./src/styles/_variables.scss) и дублируются в MUI-теме.

**Инвариант:** `$color-primary` в SCSS == `theme.palette.primary.main` в MUI.

Нарушение = расхождение оттенков между SCSS-блоками и MUI-кнопками.

## 4. Безопасность авторизации (план)

**Текущее:** access token в localStorage (уязвимо к XSS).
**Целевое:** HttpOnly + Secure + SameSite=Lax cookie, выставляемая бэком. Фронт токен не видит.
**Статус:** план — [wiki/concepts/auth-strategy.md](../wiki/concepts/auth-strategy.md). Реализуем вместе с бэком.

## 5. Правило «не плодить обёртки над MUI»

Прежде чем делать свою `<Button>` поверх MUI — **обсудить**. Часто достаточно:
- `theme.components.MuiButton.defaultProps` — глобальные дефолты,
- `sx={{...}}` — разовая правка,
- `className + .module.scss` — локальные стили.

Обёртка оправдана, только если:
1. Нужна логика, которой нет в MUI (например, `<Button isLoading>` с встроенным спиннером).
2. Страхуемся от миграции с MUI.

## 6. Валидация и формы

- Формы — только через **React Hook Form**, не через `useState` на каждое поле.
- MUI-инпуты — через `<Controller>`.
- Простая валидация — через проп `rules`. Сложная — через Zod + `@hookform/resolvers` (не установлены, добавим при необходимости).

## 7. Роутинг и group layouts

- **App Router**, не Pages.
- Route groups `(auth)` и `(dashboard)` — чтобы разделить **лейауты** без влияния на URL.
- Защита по роли: сейчас через `useAuthStore` в `layout.tsx` группы. **Middleware нет** (файл `proxy.ts` сломан, требует чинки).

## 8. Именование

- Файлы — `kebab-case.ts` или `PascalCase.tsx` для компонентов.
- Компоненты — `PascalCase`, функции — `camelCase`.
- **Булевые** — с префикса-глагола: `isLoading`, `hasPermission`, `canSubmit`. Правило ESLint.
- Тесты рядом с кодом: `Foo.tsx` + `Foo.test.tsx`.

---

# Часть IV. Альтернативные архитектуры

Сейчас проект организован **«by-type»** (по техническому типу файла):
```
src/
├── components/  ← все компоненты
├── lib/api/     ← все сервисы
├── lib/hooks/   ← все хуки
├── stores/      ← все сторы
└── types/       ← все типы
```

Это классическая слоёная архитектура. Для маленьких/средних проектов — нормально. На больших начинает ломаться: чтобы понять «что у нас с оценками», надо открыть 5 папок.

## Feature-Sliced Design (FSD)

**Альтернатива.** Группировка по **фичам**:
```
src/
├── features/
│   ├── grades/
│   │   ├── api/grades.api.ts
│   │   ├── model/types.ts
│   │   ├── hooks/useGrades.ts
│   │   └── ui/GradebookTable.tsx
│   ├── schedule/
│   │   ├── api/
│   │   ├── model/
│   │   ├── hooks/
│   │   └── ui/
│   └── ...
├── entities/       ← общие сущности (user, subject)
├── shared/         ← переиспользуемое (UI-примитивы, утилиты)
└── app/            ← Next.js роутинг
```

**Плюсы:**
- Всё про одну фичу — в одной папке.
- Легче удалять фичи (удаляешь папку — проект не ломается).
- Чёткие границы: shared не зависит от features, features не зависят друг от друга.
- FSD имеет [формальные правила зависимостей](https://feature-sliced.design/) (верхние слои могут импортировать из нижних, обратного — нет).

**Минусы:**
- Больше бойлерплейта (дополнительные папки).
- Для маленьких проектов — overkill.
- Команда должна поддерживать дисциплину.

**Когда переходить:**
- Когда реализовано 5+ фич и структура by-type уже тяготит.
- Когда в команде больше 3 человек и нужно параллельно работать.

**Наш случай:** пока откладываем. Код на 80% — заглушки. Переезжать не на что. Вернёмся к вопросу, когда будет 3–4 рабочих фичи. См. замечание №6 в [wiki/sources/pr-1-review.md](../wiki/sources/pr-1-review.md).

## Clean Architecture

Ещё строже, чем FSD. Разделение на слои **domain → application → infrastructure → ui**, с явными зависимостями (ui зависит от application, application от domain, infrastructure реализует интерфейсы domain).

**Для фронта — обычно overkill.** Применяется в корпоративных системах со сложным бизнес-процессом.

## Гибрид «by-type + feature folders»

Компромисс: общее разделение by-type, но фичи с тесной связью — в своей папке:
```
src/
├── components/
├── lib/hooks/
├── lib/api/
└── features/gradebook/   ← только сложные фичи, где всё связано
    ├── GradebookTable.tsx
    ├── useGradebook.ts
    └── exportToCsv.ts
```

**Практическое решение для нашего проекта** — если пойдём в FSD, то постепенно, не ломая всё сразу.

---

# Часть V. Что делать дальше

## Немедленно (есть данные)

1. **Верстать экраны из Figma** — логин, главная преподавателя.
2. **Заменить заглушки в `src/components/`** реальными компонентами (Header, Sidebar, SubjectCard и др.).
3. **Реализовать форму логина** через React Hook Form + MUI.

## В работе / ждёт разблокировки

4. **HttpOnly-cookies** — как только бэк реализует `/auth/login` с правильным `Set-Cookie`. План — [wiki/concepts/auth-strategy.md](../wiki/concepts/auth-strategy.md).
5. **Middleware** — починить `src/proxy.ts` → `src/middleware.ts` + реальная проверка роли.
6. **Swagger + openapi-ts** — когда бэк поднимет Swashbuckle, автогенерим типы.

## На потом

7. **FSD** — оценить после 5 реализованных фич.
8. **Prettier + Husky + lint-staged** — автоформат и pre-commit хуки.
9. **Zod + hookform/resolvers** — для сложных форм.
10. **Тесты** — пока инфраструктура пустая, начнём писать вместе с первыми реальными компонентами.

---

## Источники

- [Next.js Docs: Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js 16 App Router: The Complete Guide for 2026 (DEV)](https://dev.to/getcraftly/nextjs-16-app-router-the-complete-guide-for-2026-2hi3)
- [Next.js 16 App Router Project Structure — Definitive Guide (MakerKit)](https://makerkit.dev/blog/tutorials/nextjs-app-router-project-structure)
- [Feature-Sliced Design — Ultimate Next.js App Router Architecture](https://feature-sliced.design/blog/nextjs-app-router-guide)
- [Clean Architecture vs FSD in Next.js (Medium)](https://medium.com/@metastability/clean-architecture-vs-feature-sliced-design-in-next-js-applications-04df25e62690)
- [How to Build Reusable Architecture for Large Next.js Apps (freeCodeCamp)](https://www.freecodecamp.org/news/reusable-architecture-for-large-nextjs-applications/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Material UI Docs](https://mui.com/material-ui/getting-started/)
- [Zustand GitHub](https://github.com/pmndrs/zustand)
- [React Hook Form Docs](https://react-hook-form.com/)
- [Vitest Docs](https://vitest.dev/)
- [Playwright Docs](https://playwright.dev/)

## Связанные документы в этом репо

- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) — короткий справочник «куда что класть».
- [API_GUIDE.md](./API_GUIDE.md) — контракт фронт-бэк.
- [wiki/concepts/frontend-architecture.md](../wiki/concepts/frontend-architecture.md) — архитектурные решения (для Obsidian).
- [wiki/concepts/frontend-stack.md](../wiki/concepts/frontend-stack.md) — версии технологий.
- [wiki/concepts/auth-strategy.md](../wiki/concepts/auth-strategy.md) — план HttpOnly-cookies.
- [wiki/sources/pr-1-review.md](../wiki/sources/pr-1-review.md) — разбор замечаний Дмитрия.
