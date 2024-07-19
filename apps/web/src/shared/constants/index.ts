export const isServer = typeof window === 'undefined';

export const ROOT = '/login';
export const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/confirm-email',
  '/password-change',
];
export const DEFAULT_REDIRECT = '/news';
