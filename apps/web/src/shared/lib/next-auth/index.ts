import { authApi } from '@/entities/auth';
import Google from '@auth/core/providers/google';
import { LoginResponseDto } from '@finlerk/shared';
import NextAuth from 'next-auth';
import 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';

declare module 'next-auth' {
  interface User extends LoginResponseDto {}
  interface Session extends LoginResponseDto {}
}
declare module 'next-auth/jwt' {
  interface JWT extends LoginResponseDto {}
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
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const loginResponseDto = await authApi.credentialsLogin({
          credentials: {
            email: credentials.email as string,
            password: credentials.password as string,
          },
        });
        return loginResponseDto;
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
        token = { ...token, ...session };
        return token;
      }
      if (account) {
        if (account.provider === 'credentials') {
          return { ...token, ...user };
        } else {
          const loginResponseDto = await authApi.googleLogin({
            loginDto: {
              idToken: account.id_token,
            },
          });
          return { ...token, ...loginResponseDto };
        }
      } else if (Date.now() < token.tokenExpires) {
        return token;
      } else {
        if (!token.refreshToken) throw new Error('Missing refresh token');
        try {
          const refreshedTokens = await authApi.refreshToken({
            token: token.refreshToken,
          });
          return {
            ...token,
            ...refreshedTokens,
          };
        } catch (error) {
          return null;
        }
      }
    },
    async session({ session, token }) {
      if (session) {
        session = Object.assign({}, session, token);
      }
      return session;
    },
  },
});
