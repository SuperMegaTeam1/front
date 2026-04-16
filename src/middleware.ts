import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Защищённые маршруты — требуют токен */
const protectedPaths = ['/student', '/teacher'];

/** Публичные маршруты */
const publicPaths = ['/login'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Проверяем наличие токена в cookies или localStorage (через cookie-fallback)
  // На уровне middleware мы не имеем доступа к localStorage,
  // поэтому проверяем cookie. Если используем Zustand persist в localStorage,
  // то защита маршрутов дополнительно реализуется на клиенте.
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));

  // Базовый middleware — можно расширить при добавлении cookie-based auth
  if (isProtected) {
    // Здесь будет проверка cookie с токеном
    // Пока пропускаем — клиентская защита через useAuthStore
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
