import Google from '@auth/core/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { LoginResponseDto, User as UserDomain } from '@finlerk/shared';
import NextAuth, { User } from 'next-auth';
import 'next-auth/jwt';
import { authApi } from './lib/api/auth.api';

declare module 'next-auth' {
  interface User extends UserDomain {}
  interface Session extends LoginResponseDto {
    user: UserDomain;
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    session: LoginResponseDto;
  }
}

export const {
  handlers,
  signIn,
  signOut,
  auth,
  unstable_update: update,
} = NextAuth({
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const session = await authApi.credentialsLogin({
          email: credentials.email as string,
          password: credentials.password as string,
        });
        return session as unknown as User;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, trigger, session, user }) {
      if (trigger === 'update' && session) {
        token = { ...token, session };
        return token;
      }
      try {
        if (user) {
          token = { ...token, session: user as unknown as LoginResponseDto };
        } else if (account) {
          const session = await authApi.googleLogin({
            idToken: account.id_token,
          });
          token = { ...token, session };
        } else if (token && token.session.tokenExpires < Date.now()) {
          const refreshedTokens = await authApi.refreshToken(
            token.session.refreshToken,
          );
          token = {
            ...token,
            session: { ...token.session, ...refreshedTokens },
          };
        }
      } catch (error) {
        return null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session) {
        session = Object.assign({}, session, token.session);
      }
      return session;
    },
  },
});
