import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from '@repositories/base/base.abstract.repository';
import { SessionRepositoryInterface } from './sessiony-repository.interface';
import { Session } from '@entities/session.entity';

@Injectable()
export class SessionRepository
  extends BaseAbstractRepository<Session>
  implements SessionRepositoryInterface
{
  constructor(
    @InjectRepository(Session)
    private readonly repository: Repository<Session>,
  ) {
    super(repository);
  }
}
