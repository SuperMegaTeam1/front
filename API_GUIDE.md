# API_GUIDE — взаимодействие с бэкендом

Документ для разработчика фронта. Что знаем о бэке, как подключаться, что ждать.

---

## Состояние бэка (на 2026-04-22)

**Стек:** .NET 8, ASP.NET Core Web API, PostgreSQL, EF Core, ASP.NET Identity + JWT.

Контроллеры пока не реализованы — API в разработке. Уже настроено:
- JWT-авторизация (Bearer token, 60 мин).
- Схема БД (пользователи, роли, студенты, преподаватели, группы, предметы, пары).
- Health-check: `GET /health`.

---

## Базовый URL

В `.env.local` (не коммитить):

```
NEXT_PUBLIC_API_URL=http://localhost:53959
```

Axios-инстанс читает его из `process.env.NEXT_PUBLIC_API_URL` — подставлять его туда, не хардкодить. Prod-URL уточнять у команды.

---

## Авторизация

Бэк использует **JWT Bearer** (не cookie).

**Вход:**
```
POST /auth/login

Body:
{ "login": "string", "password": "string" }

Response:
{ "data": { "accessToken": "string", "refreshToken": "string" } }
```

Полученный `accessToken` — в `useAuthStore` (Zustand). Axios-интерсептор ([src/lib/api/axios.ts](src/lib/api/axios.ts)) сам подставляет его в каждый запрос:
```
Authorization: Bearer <accessToken>
```

**Истечение токена:** 60 минут. При `401` интерсептор делает `logout()` + редирект на `/login`. Refresh-логика пока не реализована на фронте — добавлять по мере готовности бэка.

---

## Формат ответов

Бэк всегда оборачивает данные в конверт:

```ts
// src/types/api.ts
interface ApiResponse<T> {
  data: T;
  message?: string;
}

// пагинированные списки:
interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

В хуках — двойная распаковка:
```ts
queryFn: () => api.get('/subjects').then(r => r.data.data)
//                                             ^ axios  ^ конверт
```

**Ошибки:**
```ts
interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
```

При ошибке `error.response.data` имеет этот shape.

---

## Сущности и их поля

Извлечены из схемы БД и доменных моделей бэка.

### User / ApplicationUser

```ts
interface User {
  id: string;           // Guid
  userName: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fatherName: string | null;
  timezone: string;     // default "UTC"
  pushEnabled: boolean;
  createdAt: string;    // ISO datetime
  updatedAt: string;
}
```

Роли из Identity: `"student"` | `"teacher"`. JWT-токен содержит claims `nameidentifier` (userId) и `email`.

### Student

```ts
interface Student {
  id: string;           // Guid
  parentUserId: string; // FK → User.id
  groupId: string | null;
  firstName: string;
  lastName: string;
  fatherName: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### Teacher

```ts
interface Teacher {
  id: string;
  parentUserId: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  createdAt: string;
  updatedAt: string;
}
```

### StudyGroup

```ts
interface StudyGroup {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
```

### Subject

```ts
interface Subject {
  id: string;
  name: string;
  teacherId: string;    // FK → Teacher.id
  createdAt: string;
  updatedAt: string;
}
```

### Lesson (Пара)

```ts
interface Lesson {
  id: string;
  groupId: string;      // FK → StudyGroup.id
  teacherId: string;    // FK → Teacher.id
  subjectId: string;    // FK → Subject.id
  startsAt: string;     // ISO datetime
  endsAt: string;       // ISO datetime
  createdAt: string;
  updatedAt: string;
}
```

> Посещаемость и баллы отдельными таблицами/полями — в бэке пока не реализованы.

---

## Ожидаемые эндпоинты (по требованиям)

Бэк ещё не сделал контроллеры, но ориентируемся на этот список. По мере появления — обновлять `src/lib/api/`.

| Метод | Путь | Описание | Auth |
|---|---|---|---|
| `POST` | `/auth/login` | Логин | — |
| `POST` | `/auth/refresh` | Обновление токена | — |
| `GET` | `/users/me` | Текущий пользователь + роль | ✓ |
| `GET` | `/schedule` | Расписание (день/неделя/семестр) | ✓ |
| `GET` | `/subjects` | Список предметов | ✓ |
| `GET` | `/subjects/:id` | Предмет с баллами и рейтингом | ✓ |
| `GET` | `/lessons/:id` | Страница пары | ✓ |
| `POST` | `/lessons/:id/attendance` | Выставить посещаемость | ✓ (teacher) |
| `POST` | `/lessons/:id/grades` | Выставить баллы | ✓ (teacher) |
| `GET` | `/rating` | Рейтинг студента | ✓ |
| `GET` | `/notifications` | Список уведомлений | ✓ |
| `POST` | `/notifications` | Отправить уведомление группе | ✓ (teacher) |
| `GET` | `/profile` | Профиль текущего пользователя | ✓ |

Точные пути уточнять у бэкенд-разработчика по мере реализации.

---

## Как добавить новый эндпоинт

1. **Тип** → `src/types/<feature>.ts`
2. **Сервис** → `src/lib/api/<feature>.api.ts`
   ```ts
   import api from './axios';
   import type { ApiResponse } from '@/types/api';
   import type { Lesson } from '@/types/lesson';

   export const getLesson = (id: string) =>
     api.get<ApiResponse<Lesson>>(`/lessons/${id}`);
   ```
3. **Хук** → `src/lib/hooks/use<Feature>.ts`
   ```ts
   'use client';
   import { useQuery } from '@tanstack/react-query';
   import { getLesson } from '@/lib/api/lesson.api';

   export function useLesson(id: string) {
     return useQuery({
       queryKey: ['lessons', id],
       queryFn: () => getLesson(id).then(r => r.data.data),
       enabled: !!id,
     });
   }
   ```
4. **Компонент** — `const { data, isLoading, error } = useLesson(id);`

---

## CORS

Пока не настроен на бэке. Если запросы с `localhost:3000` блокируются — сообщить бэкенд-разработчику, нужно добавить разрешение для origin фронта.
