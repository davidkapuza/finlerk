import { Api } from '@/lib/api';
import { User } from '@qbick/shared';
import { cache } from 'react';

export class UserApi extends Api {
  /**
   * Get logged user profile.
   *
   * @returns {Promise<User>} user - user information,
   */
  public getProfile = cache(() => {
    return this.get<User>('/api/v1/users/my-profile').then(
      (response) => response.data,
    );
  });
}

export const userApi = new UserApi();
