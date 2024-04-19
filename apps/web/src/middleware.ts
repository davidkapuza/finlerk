import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('access_token');
  // const refreshToken = request.cookies.get('refresh_token');

  const isAuthPage = ['/login', '/register'].includes(request.nextUrl.pathname);

  if (isAuthPage) {
    if (accessToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return null;
  }

  if (!accessToken) {
    // if (refreshToken) {
    //   console.log("refreshing in middleware...")
    //   const response = await fetch(
    //     `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/v1/auth/refresh`,
    //     {
    //       method: 'POST',
    //       credentials: 'include',
    //       headers: request.headers,
    //     },
    //   );

    //   if (response.ok) return NextResponse.next(response.clone());
    // }
    let from = request.nextUrl.pathname;
    if (request.nextUrl.search) {
      from += request.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, request.url),
    );
  }
}

export const config = {
  matcher: ['/login', '/register', '/', '/profile'],
};
