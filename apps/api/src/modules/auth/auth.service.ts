import { pool } from '@/lib/database/pool';
import { Injectable } from '@nestjs/common';
import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from 'next-auth/adapters';
import AuthPgAdapter from './auth-pg-adapter';

@Injectable()
export class AuthService {
  adapter: Adapter;

  constructor() {
    this.adapter = AuthPgAdapter(pool);
  }

  async createUser(user: AdapterUser) {
    return this.adapter.createUser(user);
  }

  async getUserByEmail(email: string) {
    return this.adapter.getUserByEmail(email);
  }

  async getUserByAccount(id: string, provider: string) {
    return this.adapter.getUserByAccount({
      providerAccountId: id,
      provider,
    });
  }

  async getUser(id: string) {
    return this.adapter.getUser(id);
  }

  async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>) {
    return this.adapter.updateUser(user);
  }

  async deleteUser(userId: string) {
    return this.adapter.deleteUser?.(userId);
  }

  async linkAccount(account: AdapterAccount) {
    return this.adapter.linkAccount(account);
  }

  async unlinkAccount(id: string, provider: string) {
    return this.adapter.unlinkAccount?.({
      providerAccountId: id,
      provider,
    });
  }

  async createSession(session: {
    sessionToken: string;
    userId: string;
    expires: Date;
  }) {
    return this.adapter.createSession(session);
  }

  async getSessionAndUser(sessionToken: string) {
    return this.adapter.getSessionAndUser(sessionToken);
  }

  async updateSession(
    session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>,
  ) {
    return this.adapter.updateSession(session);
  }

  async deleteSession(sessionToken: string) {
    return this.adapter.deleteSession(sessionToken);
  }

  async createVerificationToken(verificationToken: VerificationToken) {
    return this.adapter.createVerificationToken?.(verificationToken);
  }

  async useVerificationToken({ identifier, token }) {
    return this.adapter.useVerificationToken?.({ identifier, token });
  }
}
