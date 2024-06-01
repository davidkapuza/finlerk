import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from 'next-auth/adapters';
import { authApi } from './lib/api/auth.api';

export function AuthRestAdapter(): Adapter {
  return {
    createUser: async (user: Omit<AdapterUser, 'id'>) => {
      return authApi.createUser(user);
    },
    getUserByEmail: async (email: string) => {
      return authApi.getUserByEmail(email);
    },
    getUserByAccount: async (
      provider: Pick<AdapterAccount, 'provider' | 'providerAccountId'>,
    ) => {
      return authApi.getUserByAccount(provider);
    },
    getUser: async (id: string) => {
      return authApi.getUser(id);
    },
    updateUser: async (
      user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>,
    ) => {
      return authApi.updateUser(user);
    },
    deleteUser: async (userId: string) => {
      return authApi.deleteUser(userId);
    },
    linkAccount: async (account: AdapterAccount) => {
      return authApi.linkAccount(account);
    },
    unlinkAccount: async (
      provider: Pick<AdapterAccount, 'provider' | 'providerAccountId'>,
    ) => {
      return authApi.unlinkAccount(provider);
    },
    createSession: async (session: {
      sessionToken: string;
      userId: string;
      expires: Date;
    }) => {
      return authApi.createSession(session);
    },
    getSessionAndUser: async (sessionToken: string) => {
      return authApi.getSessionAndUser(sessionToken);
    },
    updateSession: async (
      session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>,
    ) => {
      return authApi.updateSession(session);
    },
    deleteSession: async (sessionToken: string) => {
      return authApi.deleteSession(sessionToken);
    },
    createVerificationToken: async (verificationToken: VerificationToken) => {
      return authApi.createVerificationToken(verificationToken);
    },
    useVerificationToken: async (params: {
      identifier: string;
      token: string;
    }) => {
      return authApi.useVerificationToken(params);
    },
  };
}
