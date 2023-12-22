import { Role } from '@entities/role.entity';
import { RolesEnum } from '@enums/roles.enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(Role)
    private repository: Repository<Role>,
  ) {}

  async run() {
    const countUser = await this.repository.count({
      where: {
        id: RolesEnum.user,
      },
    });

    if (!countUser) {
      await this.repository.save(
        this.repository.create({
          id: RolesEnum.user,
          name: 'User',
        }),
      );
    }

    const countAdmin = await this.repository.count({
      where: {
        id: RolesEnum.admin,
      },
    });

    if (!countAdmin) {
      await this.repository.save(
        this.repository.create({
          id: RolesEnum.admin,
          name: 'Admin',
        }),
      );
    }
  }
}
