import { Session } from '@qbick/shared';

export type JwtRefreshPayloadType = {
  sessionId: Session['id'];
  hash: Session['hash'];
  iat: number;
  exp: number;
};
