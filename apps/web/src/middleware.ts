import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const tokenExpires = request.cookies.get('tokenExpires');
  const refreshToken = request.cookies.get('refreshToken');
  const isAuth = +tokenExpires?.value > Date.now();
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }

    return null;
  }

  if (!isAuth) {
    if (refreshToken) {
      const response = await fetch(
        `${process.env.BACKEND_DOMAIN}/api/v1/auth/refresh`,
        {
          method: 'POST',
          credentials: 'include',
          headers: request.headers,
        },
      );

      if (response.status === 204) {
        return response.clone();
      }
    }
    let from = request.nextUrl.pathname;
    if (request.nextUrl.search) {
      from += request.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/auth/login?from=${encodeURIComponent(from)}`, request.url),
    );
  }
}

export const config = {
  matcher: ['/profile/:path*', '/auth/:path*'],
};
