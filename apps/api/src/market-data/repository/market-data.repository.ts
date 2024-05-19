import { AssetEntity } from '@/shared/entities/asset.entity';
import { BaseAbstractRepository } from '@/shared/repositories/base/base.abstract.repository';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions } from '@finlerk/shared';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
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
    globalFilter,
  }: {
    paginationOptions: IPaginationOptions;
    globalFilter?: string;
  }): Promise<AssetEntity[]> {
    const whereConditions:
      | FindOptionsWhere<AssetEntity>
      | FindOptionsWhere<AssetEntity>[] = [];

    if (globalFilter) {
      whereConditions.push(
        { name: ILike(`%${globalFilter}%`) },
        { symbol: ILike(`%${globalFilter}%`) },
      );
    }
    return await this.repository.find({
      where: whereConditions.length > 0 ? whereConditions : undefined,
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });
  }
}
