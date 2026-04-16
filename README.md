# Мой ИВМиИТ — Фронтенд

Веб-приложение для студентов и преподавателей ИВМиИТ.

## Технологический стек

| Категория | Технология |
|---|---|
| Основа | Next.js 15, React 19, TypeScript |
| UI | Material UI 6, SCSS Modules |
| Состояние | Zustand (клиент), TanStack Query (сервер) |
| HTTP | Axios |
| Формы | React Hook Form |
| Качество | ESLint |
| Тесты | Vitest (юнит), Playwright (E2E) |

## Быстрый старт

```bash
# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev

# Открыть http://localhost:3000
```

## Скрипты

| Команда | Описание |
|---|---|
| `npm run dev` | Запуск dev-сервера |
| `npm run build` | Продакшн-сборка |
| `npm run lint` | Проверка ESLint |
| `npm run test` | Юнит-тесты (Vitest) |
| `npm run test:e2e` | E2E-тесты (Playwright) |

## Структура проекта

```
src/
├── app/             # Маршруты (App Router)
├── components/      # Компоненты (ui, layout, shared)
├── lib/             # API, хуки, утилиты
├── stores/          # Zustand сторы
├── providers/       # React-провайдеры
├── styles/          # SCSS переменные и миксины
└── types/           # TypeScript типы
```
