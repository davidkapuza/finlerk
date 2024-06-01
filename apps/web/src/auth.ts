import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import { AuthRestAdapter } from './auth-rest-adapter';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: AuthRestAdapter(),
  pages: {
    signIn: '/login',
  },
  providers: [Google, GitHub],
});
