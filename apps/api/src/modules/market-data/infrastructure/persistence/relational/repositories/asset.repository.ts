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

  async upsertAssets(assets: Asset[]): Promise<void> {
    const chunkSize = 1000;
    const persistenceModels = assets.map(AssetMapper.toPersistence);

    for (let i = 0; i < persistenceModels.length; i += chunkSize) {
      const chunk = persistenceModels.slice(i, i + chunkSize);
      await this.repository.save(chunk, { chunk: chunkSize });
    }
  }

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
