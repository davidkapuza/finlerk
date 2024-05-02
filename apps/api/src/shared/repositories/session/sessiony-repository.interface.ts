import { SessionEntity } from '@/shared/entities/session.entity';
import { BaseInterfaceRepository } from '../base/base.interface.repository';
import { Session } from '@finlerk/shared';

export interface SessionRepositoryInterface
  extends BaseInterfaceRepository<SessionEntity> {
  createSession(
    data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>,
  ): Promise<Session>;
}
