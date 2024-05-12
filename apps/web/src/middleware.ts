import * as jose from 'jose';
import { parseSetCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import {
  RequestCookies,
  ResponseCookies,
} from 'next/dist/server/web/spec-extension/cookies';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const AUTH_PAGES = ['/login', '/register', '/confirm-email'];

function getRedirectResponse(req: NextRequest) {
  let from = req.nextUrl.pathname;
  if (req.nextUrl.search) {
    from += req.nextUrl.search;
  }

  return NextResponse.redirect(
    new URL(`/login?from=${encodeURIComponent(from)}`, req.url),
  );
}

/**
 * Copy cookies from the Set-Cookie header of the response to the Cookie header of the request,
 * so that it will appear to SSR/RSC as if the user already has the new cookies.
 */
function applySetCookie(req: NextRequest, res: NextResponse): void {
  // parse the outgoing Set-Cookie header
  const setCookies = new ResponseCookies(res.headers);
  // Build a new Cookie header for the request by adding the setCookies
  const newReqHeaders = new Headers(req.headers);
  const newReqCookies = new RequestCookies(newReqHeaders);
  setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie));
  // set “request header overrides” on the outgoing response
  NextResponse.next({
    request: { headers: newReqHeaders },
  }).headers.forEach((value, key) => {
    if (
      key === 'x-middleware-override-headers' ||
      key.startsWith('x-middleware-request-')
    ) {
      res.headers.set(key, value);
    }
  });
}

async function getResponseWithRefreshedTokens(
  req: NextRequest,
  isAuthPage: boolean,
) {
  const refreshResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_DOMAIN}/api/v1/auth/refresh`,
    {
      method: 'POST',
      credentials: 'include',
      headers: req.headers,
    },
  );
  if (!refreshResponse.ok) return getRedirectResponse(req);

  const response = isAuthPage
    ? NextResponse.redirect(new URL('/news', req.url))
    : NextResponse.next();

  const responseCookies = refreshResponse.headers
    .get('set-cookie')
    .split(/,\s(?=refresh_token)/);

  responseCookies.forEach((cookie) => {
    response.cookies.set(parseSetCookie(cookie));
  });

  applySetCookie(req, response);

  return response;
}

export async function middleware(req: NextRequest) {
  if (req.method === 'OPTIONS') {
    return NextResponse.json({});
  }

  const isAuthPage = AUTH_PAGES.some((page) =>
    req.nextUrl.pathname.startsWith(page),
  );

  const accessToken = req.cookies.get('access_token');
  const refreshToken = req.cookies.get('refresh_token');

  if (!accessToken && !refreshToken) return getRedirectResponse(req);

  if (accessToken) {
    const secretKeyBuffer = Buffer.from(process.env.AUTH_JWT_SECRET, 'utf-8');
    try {
      await jose.jwtVerify(accessToken.value, secretKeyBuffer);
      if (isAuthPage) return NextResponse.redirect(new URL('/news', req.url));
      return NextResponse.next();
    } catch (error) {
      return getRedirectResponse(req);
    }
  } else if (refreshToken) {
    const response = await getResponseWithRefreshedTokens(req, isAuthPage);
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
