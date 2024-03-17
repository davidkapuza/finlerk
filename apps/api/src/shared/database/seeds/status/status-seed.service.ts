import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StatusEntity, StatusesEnum } from '@qbick/shared';
import { Repository } from 'typeorm';

@Injectable()
export class StatusSeedService {
  constructor(
    @InjectRepository(StatusEntity)
    private repository: Repository<StatusEntity>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (!count) {
      await this.repository.save([
        this.repository.create({
          id: StatusesEnum.active,
          name: 'Active',
        }),
        this.repository.create({
          id: StatusesEnum.inactive,
          name: 'Inactive',
        }),
      ]);
    }
  }
}
