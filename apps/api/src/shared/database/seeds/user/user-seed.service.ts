import { RolesEnum } from '@enums/roles.enum';
import { StatusesEnum } from '@enums/statuses.enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  async run() {
    const countAdmin = await this.repository.count({
      where: {
        role: {
          id: RolesEnum.admin,
        },
      },
    });

    if (!countAdmin) {
      await this.repository.save(
        this.repository.create({
          firstName: 'Super',
          lastName: 'Admin',
          email: 'admin@example.com',
          password: 'secret',
          role: {
            id: RolesEnum.admin,
            name: 'Admin',
          },
          status: {
            id: StatusesEnum.active,
            name: 'Active',
          },
        }),
      );
    }

    const countUser = await this.repository.count({
      where: {
        role: {
          id: RolesEnum.user,
        },
      },
    });

    if (!countUser) {
      await this.repository.save(
        this.repository.create({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          password: 'secret',
          role: {
            id: RolesEnum.user,
            name: 'Admin',
          },
          status: {
            id: StatusesEnum.active,
            name: 'Active',
          },
        }),
      );
    }
  }
}
