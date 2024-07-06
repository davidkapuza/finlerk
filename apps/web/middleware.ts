import { auth } from '@/auth';
import { DEFAULT_REDIRECT, PUBLIC_ROUTES, ROOT } from './src/routes';

export default auth(async (req) => {
  const { nextUrl } = req;

  const isAuthenticated = req.auth && req.auth.tokenExpires > Date.now();

  const isPublicRoute = PUBLIC_ROUTES.includes(nextUrl.pathname);

  if (isPublicRoute && isAuthenticated)
    return Response.redirect(new URL(DEFAULT_REDIRECT, nextUrl));

  if (!isAuthenticated && !isPublicRoute)
    return Response.redirect(new URL(ROOT, nextUrl));
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
