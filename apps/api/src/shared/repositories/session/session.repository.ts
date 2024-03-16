import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionRepositoryInterface } from './sessiony-repository.interface';
import { BaseAbstractRepository } from '../base/base.abstract.repository';
import { Session } from '@qbick/shared/entities';

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
