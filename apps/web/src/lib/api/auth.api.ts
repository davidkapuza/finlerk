import {
  AuthEmailLoginDto,
  AuthGoogleLoginDto,
  LoginResponseDto,
  RefreshResponseDto,
} from '@finlerk/shared';
import { ApiClient } from './api-client';

export class AuthApi extends ApiClient {
  async googleLogin(payload: AuthGoogleLoginDto): Promise<LoginResponseDto> {
    const response = await this.post<LoginResponseDto, AuthGoogleLoginDto>(
      '/api/v1/auth/google/login',
      payload,
    );
    return response.data;
  }

  async credentialsLogin(
    payload: AuthEmailLoginDto,
  ): Promise<LoginResponseDto> {
    const response = await this.post<LoginResponseDto, AuthEmailLoginDto>(
      '/api/v1/auth/email/login',
      payload,
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

  async logout(): Promise<void> {
    this.post('/api/v1/auth/logout');
  }
}

export const authApi = new AuthApi();
