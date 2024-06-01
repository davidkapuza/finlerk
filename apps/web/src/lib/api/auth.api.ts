import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from 'next-auth/adapters';
import { format } from '@/lib/utils';
import { Api } from '@/lib/api';

export class AuthApi extends Api implements Adapter {
  async createUser(user: Omit<AdapterUser, 'id'>) {
    const response = await this.post<AdapterUser, Omit<AdapterUser, 'id'>>(
      '/api/v1/auth',
      user,
    );
    return format.from<AdapterUser>(response.data);
  }
  async getUserByEmail(email: string) {
    const response = await this.get<AdapterUser>(`/api/v1/auth/${email}`);
    return response.data ? format.from<AdapterUser>(response.data) : null;
  }
  async getUserByAccount({
    providerAccountId,
    provider,
  }: Pick<AdapterAccount, 'provider' | 'providerAccountId'>) {
    const response = await this.get<AdapterUser>(
      `/api/v1/auth/account/${provider}/${providerAccountId}`,
    );
    return response.data ? format.from<AdapterUser>(response.data) : null;
  }
  async getUser(id: string) {
    const response = await this.get<AdapterUser>(`/api/v1/auth/${id}`);
    return response.data ? format.from<AdapterUser>(response.data) : null;
  }
  async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, 'id'>) {
    const response = await this.patch<AdapterUser>('/api/v1/auth', user);
    return format.from<AdapterUser>(response.data);
  }
  async deleteUser(userId: string) {
    const response = await this.delete<AdapterUser>(`/api/v1/auth/${userId}`);
    return response.data ? format.from<AdapterUser>(response.data) : null;
  }
  async linkAccount(account: AdapterAccount) {
    const response = await this.post<AdapterAccount>(
      '/api/v1/auth/account',
      account,
    );
    return response.data ? format.from<AdapterAccount>(response.data) : null;
  }
  async unlinkAccount({
    providerAccountId,
    provider,
  }: Pick<AdapterAccount, 'provider' | 'providerAccountId'>) {
    const response = await this.delete(
      `/api/v1/auth/account/${provider}/${providerAccountId}`,
    );
    const data = await response.json();
    return data ? format.from<AdapterAccount>(data) : data;
  }
  async createSession(session: {
    sessionToken: string;
    userId: string;
    expires: Date;
  }) {
    const response = await this.post<AdapterSession>(
      '/api/v1/auth/session',
      session,
    );
    return response.data ? format.from<AdapterSession>(response.data) : null;
  }
  async getSessionAndUser(sessionToken: string) {
    const response = await this.get<{
      session: AdapterSession;
      user: AdapterUser;
    }>(`/api/v1/auth/session/${sessionToken}`);
    if (!response.data) return null;

    const session = format.from<AdapterSession>(response.data.session);
    const user = format.from<AdapterUser>(response.data.user);
    return { session, user };
  }
  async updateSession(
    session: Partial<AdapterSession> & Pick<AdapterSession, 'sessionToken'>,
  ) {
    const response = await this.patch<AdapterSession>(
      '/api/v1/auth/session',
      session,
    );
    return response.data ? format.from<AdapterSession>(response.data) : null;
  }
  async deleteSession(sessionToken: string) {
    const response = await this.delete<AdapterSession>(
      `/api/v1/auth/session/${sessionToken}`,
    );
    return response.data ? format.from<AdapterSession>(response.data) : null;
  }
  async createVerificationToken(verificationToken: VerificationToken) {
    const response = await this.post<VerificationToken, VerificationToken>(
      '/api/v1/auth/verification',
      verificationToken,
    );
    return response.data ? format.from<VerificationToken>(response.data) : null;
  }
  async useVerificationToken(params: { identifier: string; token: string }) {
    const response = await this.patch<VerificationToken>(
      `/api/v1/auth/verification`,
      params,
    );
    return response.data ? format.from<VerificationToken>(response.data) : null;
  }
}
export const authApi = new AuthApi();
