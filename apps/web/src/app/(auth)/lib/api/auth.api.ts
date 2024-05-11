import { Api } from '@/shared/api';
import {
  AuthGoogleLoginDto,
  ConfirmEmailType,
  LoginRequestType,
  RegisterRequestType,
  User,
} from '@finlerk/shared';

export class AuthApi extends Api {
  constructor() {
    super();
    this.login = this.login.bind(this);
    this.getGoogleLoginUrl = this.getGoogleLoginUrl.bind(this);
    this.register = this.register.bind(this);
    this.confirmEamil = this.confirmEamil.bind(this);
  }
  /**
   * Login user.
   *
   * @param {object} payload - user's credentials.
   * @param {string} payload.email - user's email.
   * @param {string} payload.password - user's password.
   * @returns {Promise<User>} user - user information,
   */
  public login(payload: LoginRequestType): Promise<User> {
    return this.post('/api/v1/auth/login', {
      body: JSON.stringify(payload),
    }).then((res) => res.json());
  }

  /**
   * Get google login url.
   *.
   * @returns {Promise<string>} string - login url,
   */
  public getGoogleLoginUrl(): Promise<{ url: string }> {
    return this.get('/api/v1/auth/google/login-url').then((res) => res.json());
  }

  /**
   * Get google login url.
   *.
   * @returns {Promise<string>} string - login url,
   */
  public googleLogin(payload: AuthGoogleLoginDto): Promise<User> {
    return this.post('/api/v1/auth/google/login', {
      body: JSON.stringify(payload),
    }).then((res) => res.json());
  }

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
  public register(payload: RegisterRequestType): Promise<void> {
    return this.post('/api/v1/auth/register', {
      body: JSON.stringify(payload),
    }).then((res) => res.json());
  }
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
  public confirmEamil(payload: ConfirmEmailType): Promise<void> {
    return this.post('/api/v1/auth/confirm-email', {
      body: JSON.stringify(payload),
    }).then((res) => res.json());
  }
}

export const authApi = new AuthApi();
