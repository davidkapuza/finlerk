import { Session, UserEntity } from '@qbick/shared/entities';

export type JwtPayloadType = Pick<UserEntity, 'id' | 'role'> & {
  sessionId: Session['id'];
  iat: number;
  exp: number;
};
