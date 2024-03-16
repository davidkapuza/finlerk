import { UserEntity } from '../../entities';

export type LoginResponseType = Readonly<{
  accessToken: string;
  refreshToken: string;
  tokenExpires: number;
  user: UserEntity;
}>;
