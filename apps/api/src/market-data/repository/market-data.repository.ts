import { AssetEntity } from '@/shared/entities/asset.entity';
import { BaseAbstractRepository } from '@/shared/repositories/base/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions } from '@qbick/shared';
import { Repository } from 'typeorm';
import { MarketDataRepositoryInterface } from './market-data-repository.interface';

@Injectable()
export class MarketDataRepository
  extends BaseAbstractRepository<AssetEntity>
  implements MarketDataRepositoryInterface
{
  constructor(
    @InjectRepository(AssetEntity)
    private readonly repository: Repository<AssetEntity>,
  ) {
    super(repository);
  }

  async findManyWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AssetEntity[]> {
    return await this.repository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }
}
