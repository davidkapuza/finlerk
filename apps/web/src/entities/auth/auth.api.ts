import { baseUrl } from '@/shared/api';
import { createJsonMutation } from '@/shared/lib/fetch';
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

export async function credentialsLogin(params: {
  credentials: AuthEmailLoginDto;
}) {
  return createJsonMutation<LoginResponseDto>({
    request: {
      url: baseUrl('/v1/auth/email/login'),
      method: 'POST',
      body: JSON.stringify(params.credentials),
    },
  });
}

export async function credentialsRegistration(params: {
  credentials: AuthRegisterLoginDto;
}) {
  return createJsonMutation({
    request: {
      url: baseUrl('/v1/auth/email/register'),
      method: 'POST',
      body: JSON.stringify(params.credentials),
    },
  });
}

export async function googleLogin(params: { loginDto: AuthGoogleLoginDto }) {
  return createJsonMutation<LoginResponseDto>({
    request: {
      url: baseUrl('/v1/auth/google/login'),
      method: 'POST',
      body: JSON.stringify(params.loginDto),
    },
  });
}

// For Server Components use only
export async function refreshToken(params: { token: string }) {
  return createJsonMutation<RefreshResponseDto>({
    request: {
      url: baseUrl('/v1/auth/refresh'),
      method: 'POST',
      headers: { Authorization: `Bearer ${params.token}` },
    },
  });
}

export async function confirmEmail(params: {
  confirmEmailDto: AuthConfirmEmailDto;
}) {
  return createJsonMutation({
    request: {
      url: baseUrl('/v1/auth/email/confirm'),
      method: 'POST',
      body: JSON.stringify(params.confirmEmailDto),
    },
  });
}

export async function forgotPassword(params: {
  forgoPasswordDto: AuthForgotPasswordDto;
}) {
  return createJsonMutation({
    request: {
      url: baseUrl('/v1/auth/forgot/password'),
      method: 'POST',
      body: JSON.stringify(params.forgoPasswordDto),
    },
  });
}

export async function resetPassword(params: {
  resetPasswordDto: AuthResetPasswordDto;
}) {
  return createJsonMutation({
    request: {
      url: baseUrl('/v1/auth/reset/password'),
      method: 'POST',
      body: JSON.stringify(params.resetPasswordDto),
    },
  });
}

export async function logout() {
  return createJsonMutation({
    request: {
      url: baseUrl('/v1/auth/logout'),
      method: 'POST',
    },
  });
}
