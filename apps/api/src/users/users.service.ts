import { AuthProvidersEnum } from '@/auth/enums/auth-providers.enum';
import { UserEntity } from '@/shared/entities/user.entity';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { StatusesEnum } from '@/shared/enums/statuses.enum';
import {
  HttpStatus,
  Inject,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  DeepPartial,
  IPaginationOptions,
  NullableType,
  User,
} from '@finlerk/shared';
import bcrypt from 'bcryptjs';
import { FindOneOptions } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { FilterUserDto, SortUserDto } from './dtos/query-user.dto';
import { UsersRepositoryInterface } from './repository/users-repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly userRepository: UsersRepositoryInterface,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const clonedPayload = {
      provider: AuthProvidersEnum.email,
      ...createUserDto,
    };

    if (clonedPayload.email) {
      const userObject = await this.userRepository.findByCondition({
        where: {
          email: clonedPayload.email,
        },
      });
      if (userObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }
    }

    if (clonedPayload.role?.id) {
      const roleObject = Object.values(RolesEnum).includes(
        clonedPayload.role.id,
      );
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }
    }

    if (clonedPayload.status?.id) {
      const statusObject = Object.values(StatusesEnum).includes(
        clonedPayload.status.id,
      );
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        });
      }
    }

    return this.userRepository.createUser(clonedPayload);
  }

  findOne(fields: FindOneOptions<UserEntity>): Promise<NullableType<User>> {
    return this.userRepository.findByCondition(fields);
  }

  findById(id: User['id']): Promise<NullableType<User>> {
    return this.userRepository.findOneById(id);
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

  findOneById(id: number | string): Promise<NullableType<User>> {
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
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }
    }

    if (clonedPayload.role?.id) {
      const roleObject = Object.values(RolesEnum).includes(
        clonedPayload.role.id,
      );
      if (!roleObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            role: 'roleNotExists',
          },
        });
      }
    }

    if (clonedPayload.status?.id) {
      const statusObject = Object.values(StatusesEnum).includes(
        clonedPayload.status.id,
      );
      if (!statusObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            status: 'statusNotExists',
          },
        });
      }
    }

    return this.userRepository.update(id, clonedPayload);
  }

  async softDelete(id: User['id']): Promise<void> {
    await this.userRepository.softDelete(id);
  }
}
