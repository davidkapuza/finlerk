import {
  AuthConfirmEmailDto,
  AuthEmailLoginDto,
  AuthGoogleLoginDto,
  AuthRegisterLoginDto,
  LoginResponseDto,
  RefreshResponseDto,
} from '@finlerk/shared';
import { ApiClient, RequestResponse } from './api-client';

export class AuthApi extends ApiClient {
  async googleLogin(payload: AuthGoogleLoginDto): Promise<LoginResponseDto> {
    const response = await this.post<LoginResponseDto, AuthGoogleLoginDto>(
      '/api/v1/auth/google/login',
      payload,
    );
    return response.data;
  }

  async credentialsRegistration(
    credentials: AuthRegisterLoginDto,
  ): Promise<RequestResponse<void>> {
    return this.post<void, AuthRegisterLoginDto>(
      '/api/v1/auth/email/register',
      credentials,
    );
  }

  async credentialsLogin(
    credentials: AuthEmailLoginDto,
  ): Promise<LoginResponseDto> {
    const response = await this.post<LoginResponseDto, AuthEmailLoginDto>(
      '/api/v1/auth/email/login',
      credentials,
    );
    return response.data;
  }

  async refreshToken(token: string): Promise<RefreshResponseDto> {
    const response = await this.post<RefreshResponseDto>(
      '/api/v1/auth/refresh',
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }

  async confirmEmail(
    payload: AuthConfirmEmailDto,
  ): Promise<RequestResponse<void>> {
    return await this.post<void, AuthConfirmEmailDto>(
      '/api/v1/auth/email/confirm',
      payload,
    );
  }

  async logout(): Promise<void> {
    this.post('/api/v1/auth/logout');
  }
}

export const authApi = new AuthApi();
