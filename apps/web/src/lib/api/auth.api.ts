import {
  AuthConfirmEmailDto,
  AuthEmailLoginDto,
  AuthForgotPasswordDto,
  AuthGoogleLoginDto,
  AuthRegisterLoginDto,
  AuthResetPasswordDto,
  LoginResponseDto,
  RefreshResponseDto,
} from '@finlerk/shared';
import { ApiClient, RequestResponse } from './api-client';

export class AuthApi extends ApiClient {
  /**
   * Logs in a user with Google credentials.
   * @param {AuthGoogleLoginDto} payload - The Google login payload.
   * @returns {Promise<LoginResponseDto>} - The login response.
   */
  async googleLogin(payload: AuthGoogleLoginDto): Promise<LoginResponseDto> {
    const response = await this.post<LoginResponseDto, AuthGoogleLoginDto>(
      '/api/v1/auth/google/login',
      payload,
    );
    return response.data;
  }

  /**
   * Registers a new user with email credentials.
   * @param {AuthRegisterLoginDto} credentials - The registration payload.
   * @returns {Promise<RequestResponse<void>>} - The registration response.
   */
  async credentialsRegistration(
    credentials: AuthRegisterLoginDto,
  ): Promise<RequestResponse<void>> {
    return this.post<void, AuthRegisterLoginDto>(
      '/api/v1/auth/email/register',
      credentials,
    );
  }

  /**
   * Logs in a user with email credentials.
   * @param {AuthEmailLoginDto} credentials - The login payload.
   * @returns {Promise<LoginResponseDto>} - The login response.
   */
  async credentialsLogin(
    credentials: AuthEmailLoginDto,
  ): Promise<LoginResponseDto> {
    const response = await this.post<LoginResponseDto, AuthEmailLoginDto>(
      '/api/v1/auth/email/login',
      credentials,
    );
    return response.data;
  }

  /**
   * Refreshes an authentication token.
   * @param {string} token - The refresh token.
   * @returns {Promise<RefreshResponseDto>} - The refresh response.
   */
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

  /**
   * Confirms a user's email address.
   * @param {AuthConfirmEmailDto} payload - The email confirmation payload.
   * @returns {Promise<RequestResponse<void>>} - The email confirmation response.
   */
  async confirmEmail(
    payload: AuthConfirmEmailDto,
  ): Promise<RequestResponse<void>> {
    return await this.post<void, AuthConfirmEmailDto>(
      '/api/v1/auth/email/confirm',
      payload,
    );
  }

  /**
   * Initiates a password reset request.
   * @param {AuthForgotPasswordDto} payload - The forgot password payload.
   * @returns {Promise<RequestResponse<void>>} - The forgot password response.
   */
  async forgotPassword(
    payload: AuthForgotPasswordDto,
  ): Promise<RequestResponse<void>> {
    return await this.post<void, AuthForgotPasswordDto>(
      '/api/v1/auth/forgot/password',
      payload,
    );
  }

  /**
   * Resets a user's password.
   * @param {AuthResetPasswordDto} payload - The reset password payload.
   * @returns {Promise<RequestResponse<void>>} - The reset password response.
   */
  async resetPassword(
    payload: AuthResetPasswordDto,
  ): Promise<RequestResponse<void>> {
    return await this.post<void, AuthResetPasswordDto>(
      '/api/v1/auth/reset/password',
      payload,
    );
  }

  /**
   * Logs out the current user.
   * @returns {Promise<void>} - The logout response.
   */
  async logout(): Promise<void> {
    this.post('/api/v1/auth/logout');
  }
}

export const authApi = new AuthApi();
