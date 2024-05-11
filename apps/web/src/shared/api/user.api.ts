import { Api } from './api';
import { User } from '@finlerk/shared';

export class UserApi extends Api {
  constructor() {
    super();
    this.getProfile = this.getProfile.bind(this);
  }
  /**
   * Get logged user profile.
   *
   * @returns {Promise<User>} user - user information,
   */
  public getProfile(): Promise<User> {
    return this.get('/api/v1/users/my-profile').then((response) =>
      response.json(),
    );
  }
}

export const userApi = new UserApi();
