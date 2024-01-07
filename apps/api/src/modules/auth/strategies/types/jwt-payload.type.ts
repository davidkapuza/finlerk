import { Session } from '@entities/session.entity';
import { UserEntity } from '@entities/user.entity';

export type JwtPayloadType = Pick<UserEntity, 'id' | 'role'> & {
  sessionId: Session['id'];
  iat: number;
  exp: number;
};
