import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@entities/user.entity';
import { Repository } from 'typeorm';
import { BaseAbstractRepository } from '@repositories/base/base.abstract.repository';
import { UserRepositoryInterface } from './user-repository.interface';

@Injectable()
export class UserRepository
  extends BaseAbstractRepository<User>
  implements UserRepositoryInterface
{
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {
    super(repository);
  }
}
