import { User } from '../../domains/user';

export type LoginResponseType = Readonly<{
  accessToken: string;
  refreshToken: string;
  tokenExpires: number;
  user: User;
}>;
