import { BaseInterfaceRepository } from '@repositories/base/base.interface.repository';
import { UserEntity } from '@entities/user.entity';
import { FilterUserDto, SortUserDto } from '@modules/users/dtos/query-user.dto';
import { IPaginationOptions } from '../../../shared/types/pagination-options';
import { User } from '../domain/user';
import { DeepPartial } from 'typeorm';

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
