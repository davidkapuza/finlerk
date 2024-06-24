import { Asset, IPaginationOptions } from '@finlerk/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { AssetRepository } from '../../asset.repository';
import { AssetEntity } from '../entities/asset.entity';
import { AssetMapper } from '../mappers/asset.mapper';

@Injectable()
export class AssetRelationalRepository implements AssetRepository {
  constructor(
    @InjectRepository(AssetEntity)
    private readonly repository: Repository<AssetEntity>,
  ) {}

  async findManyWithPagination({
    paginationOptions,
    globalFilter,
  }: {
    paginationOptions: IPaginationOptions;
    globalFilter?: string;
  }): Promise<Asset[]> {
    const where: FindOptionsWhere<AssetEntity>[] = [];

    if (globalFilter?.length) {
      where.push({ name: ILike(`%${globalFilter}%`) });
      where.push({ symbol: ILike(`%${globalFilter}%`) });
    }
    const entities = await this.repository.find({
      where: globalFilter ? where : {},
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((asset) => AssetMapper.toDomain(asset));
  }
}
