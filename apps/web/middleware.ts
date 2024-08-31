import 'reflect-metadata';
import { auth } from '@/shared/lib/next-auth';

const authRoutes = [
  '/login',
  '/register',
  '/confirm-email',
  '/password-change',
];
const publicRoutes = ['/', ...authRoutes];

export default auth(async (req) => {
  const { nextUrl } = req;

  const isAuthenticated = !!req.auth;

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  if (isAuthRoute && isAuthenticated)
    return Response.redirect(new URL('/stocks', nextUrl));

  if (!isAuthenticated && !isPublicRoute)
    return Response.redirect(new URL('/login', nextUrl));
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
