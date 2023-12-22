import { BaseInterfaceRepository } from '@repositories/base/base.interface.repository';
import { User } from '@entities/user.entity';

export type UserRepositoryInterface = BaseInterfaceRepository<User>;
