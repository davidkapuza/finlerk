import { User } from '../../domains/user';

export type LoginResponseType = Readonly<{
  accessToken: string;
  refreshToken: string;
  user: User;
}>;
