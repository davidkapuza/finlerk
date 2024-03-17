import { RoleEntity } from '@/shared/entities/role.entity';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleSeedService {
  constructor(
    @InjectRepository(RoleEntity)
    private repository: Repository<RoleEntity>,
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
