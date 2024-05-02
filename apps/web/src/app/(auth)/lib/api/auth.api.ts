import { Api } from '@/lib/api';
import {
  AuthGoogleLoginDto,
  ConfirmEmailType,
  LoginRequestType,
  RegisterRequestType,
  User,
} from '@finlerk/shared';

export class AuthApi extends Api {
  /**
   * Login user.
   *
   * @param {object} payload - user's credentials.
   * @param {string} payload.email - user's email.
   * @param {string} payload.password - user's password.
   * @returns {Promise<User>} user - user information,
   */
  public login = (payload: LoginRequestType): Promise<User> => {
    return this.post<User, LoginRequestType>(
      '/api/v1/auth/login',
      payload,
    ).then(this.success);
  };

  /**
   * Get google login url.
   *.
   * @returns {Promise<string>} string - login url,
   */
  public getGoogleLoginUrl = (): Promise<string> => {
    return this.get<string>('/api/v1/auth/google/login-url').then(this.success);
  };

  /**
   * Get google login url.
   *.
   * @returns {Promise<string>} string - login url,
   */
  public googleLogin = (payload: AuthGoogleLoginDto): Promise<User> => {
    return this.post<User, AuthGoogleLoginDto>(
      '/api/v1/auth/google/login',
      payload,
    ).then(this.success);
  };

  /**
   * Register new user.
   *
   * @param {object} RegisterRequestType - user basic info.
   * @param {string} RegisterRequestType.firstName.
   * @param {string} RegisterRequestType.lastName.
   * @param {string} RegisterRequestType.email.
   * @param {string} RegisterRequestType.password.
   * @returns {Promise<void>} successful request.
   */
  public register = (payload: RegisterRequestType): Promise<void> => {
    return this.post<void, RegisterRequestType>(
      '/api/v1/auth/register',
      payload,
    ).then(this.success);
  };
  /**
   * Register new user.
   *
   * @param {object} RegisterRequestType - user basic info.
   * @param {string} RegisterRequestType.firstName.
   * @param {string} RegisterRequestType.lastName.
   * @param {string} RegisterRequestType.email.
   * @param {string} RegisterRequestType.password.
   * @returns {Promise<void>} successful request.
   */
  public confirmEamil = (payload: ConfirmEmailType): Promise<void> => {
    return this.post<void, ConfirmEmailType>(
      '/api/v1/auth/confirm-email',
      payload,
    ).then(this.success);
  };
}

export const authApi = new AuthApi();
