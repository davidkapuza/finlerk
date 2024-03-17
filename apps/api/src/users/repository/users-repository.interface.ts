import { BaseInterfaceRepository } from '@/shared/repositories/base/base.interface.repository';
import { UserEntity } from '@qbick/shared';
import { DeepPartial } from 'typeorm';
import { User } from '../domain/user';
import { FilterUserDto, SortUserDto } from '../dtos/query-user.dto';
import { IPaginationOptions } from '@/shared/types/pagination-options';

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
  }): Promise<UserEntity[]>;
  update(id: User['id'], payload: DeepPartial<User>): Promise<User | null>;
}
