import { UserEntity } from '@entities/user.entity';

export type LoginResponseType = Readonly<{
  accessToken: string;
  refreshToken: string;
  tokenExpires: number;
  user: UserEntity;
}>;
