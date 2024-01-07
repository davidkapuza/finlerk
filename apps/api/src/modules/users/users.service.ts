import { AuthProvidersEnum } from '@auth/enums/auth-providers.enum';
import { RolesEnum } from '@enums/roles.enum';
import { StatusesEnum } from '@enums/statuses.enum';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UsersRepositoryInterface } from '@modules/users/repository/users-repository.interface';
import bcrypt from 'bcryptjs';
import { DeepPartial } from '../../shared/types/deepl-partial.type';
import { NullableType } from '../../shared/types/nullable.type';
import { IPaginationOptions } from '../../shared/types/pagination-options';
import { User } from './domain/user';
import { CreateUserDto } from './dtos/create-user.dto';
import { FilterUserDto, SortUserDto } from './dtos/query-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly userRepository: UsersRepositoryInterface,
  ) {}

  async create(createProfileDto: CreateUserDto): Promise<User> {
    const clonedPayload = {
      provider: AuthProvidersEnum.email,
      ...createProfileDto,
    };

    if (clonedPayload.password) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.email) {
      const userObject = await this.userRepository.findByCondition({
        where: {
          email: clonedPayload.email,
        },
      });
      if (userObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              email: 'emailAlreadyExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.role?.id) {
      const roleObject = Object.values(RolesEnum).includes(
        clonedPayload.role.id,
      );
      if (!roleObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              role: 'roleNotExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.status?.id) {
      const statusObject = Object.values(StatusesEnum).includes(
        clonedPayload.status.id,
      );
      if (!statusObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              status: 'statusNotExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    return this.userRepository.create(clonedPayload);
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterUserDto | null;
    sortOptions?: SortUserDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<User[]> {
    return this.userRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  findOneById(id: number): Promise<NullableType<User>> {
    return this.userRepository.findOneById(id);
  }

  async update(
    id: User['id'],
    payload: DeepPartial<User>,
  ): Promise<User | null> {
    const clonedPayload = { ...payload };

    if (
      clonedPayload.password &&
      clonedPayload.previousPassword !== clonedPayload.password
    ) {
      const salt = await bcrypt.genSalt();
      clonedPayload.password = await bcrypt.hash(clonedPayload.password, salt);
    }

    if (clonedPayload.email) {
      const userObject = await this.userRepository.findByCondition({
        where: {
          email: clonedPayload.email,
        },
      });

      if (userObject?.id !== id) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              email: 'emailAlreadyExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.role?.id) {
      const roleObject = Object.values(RolesEnum).includes(
        clonedPayload.role.id,
      );
      if (!roleObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              role: 'roleNotExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    if (clonedPayload.status?.id) {
      const statusObject = Object.values(StatusesEnum).includes(
        clonedPayload.status.id,
      );
      if (!statusObject) {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              status: 'statusNotExists',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    return this.userRepository.update(id, clonedPayload);
  }

  async softDelete(id: User['id']): Promise<void> {
    await this.userRepository.softDelete(id);
  }
}
