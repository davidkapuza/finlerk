import { AssetEntity } from '@/modules/market-data/infrastructure/persistence/relational/entities/asset.entity';
import { AssetMapper } from '@/modules/market-data/infrastructure/persistence/relational/mappers/asset.mapper';
import { MarketDataService } from '@/modules/market-data/market-data.service';
import { AssetStatusEnum } from '@finlerk/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AssetSeedService {
  constructor(
    @InjectRepository(AssetEntity)
    private repository: Repository<AssetEntity>,
    private readonly marketDataService: MarketDataService,
  ) {}

  async run() {
    const assets = await this.marketDataService.getAssets({
      status: AssetStatusEnum.active,
    });

    const persistenceModels = assets.map(AssetMapper.toPersistence);

    await this.repository
      .createQueryBuilder()
      .insert()
      .into(AssetEntity)
      .values(persistenceModels)
      .execute();
  }
}
