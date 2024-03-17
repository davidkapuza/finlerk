import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionRepositoryInterface } from './sessiony-repository.interface';
import { BaseAbstractRepository } from '../base/base.abstract.repository';
import { SessionEntity } from '@/shared/entities/session.entity';
import { Session } from '@qbick/shared';
import { SessionMapper } from '@/shared/mappers/session.mapper';

@Injectable()
export class SessionRepository
  extends BaseAbstractRepository<SessionEntity>
  implements SessionRepositoryInterface
{
  constructor(
    @InjectRepository(SessionEntity)
    private readonly repository: Repository<SessionEntity>,
  ) {
    super(repository);
  }

  async createSession(data: Session): Promise<Session> {
    const persistenceModel = SessionMapper.toPersistence(data);
    return this.repository.save(this.repository.create(persistenceModel));
  }
}
