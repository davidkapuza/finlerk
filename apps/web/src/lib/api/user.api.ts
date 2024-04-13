import { Api } from '@/lib/api';
import { apiConfig } from '@/lib/config/api.config';
import { User } from '@qbick/shared';
import { cache } from 'react';

export class UserApi extends Api {
  /**
   * Get logged user profile.
   *
   * @returns {Promise<User>} user - user information,
   */
  public getProfile = cache((): Promise<User> => {
    return this.get<User>('/api/v1/users/my-profile').then(this.success);
  });
}

export const userApi = new UserApi(apiConfig);
