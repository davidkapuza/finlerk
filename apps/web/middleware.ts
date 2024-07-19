import 'reflect-metadata';
import { auth } from '@/shared/lib/next-auth';
import { DEFAULT_REDIRECT, PUBLIC_ROUTES, ROOT } from '@/shared/constants';

export default auth(async (req) => {
  const { nextUrl } = req;

  const isAuthenticated = !!req.auth;

  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  if (isPublicRoute && isAuthenticated)
    return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));

  if (!isAuthenticated && !isPublicRoute)
    return Response.redirect(new URL(ROOT, nextUrl));
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
