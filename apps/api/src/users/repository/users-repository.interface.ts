import { BaseInterfaceRepository } from '@/shared/repositories/base/base.interface.repository';
import { DeepPartial } from 'typeorm';
import { FilterUserDto, SortUserDto } from '../dtos/query-user.dto';
import { IPaginationOptions } from '@/shared/types/pagination-options';
import { UserEntity } from '@/shared/entities/user.entity';
import { User } from '@qbick/shared';

export interface UsersRepositoryInterface
  extends BaseInterfaceRepository<UserEntity> {
  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]>;
  createUser(
    data: Omit<User, 'id' | 'createdAt' | 'deletedAt' | 'updatedAt'>,
  ): Promise<User>;
  update(id: User['id'], payload: DeepPartial<User>): Promise<User | null>;
}
