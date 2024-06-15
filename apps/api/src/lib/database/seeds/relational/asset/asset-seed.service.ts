import { AssetMapper } from '@/modules/market-data/mappers/asset.mapper';
import { MarketDataService } from '@/modules/market-data/market-data.service';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetStatusEnum } from '@finlerk/shared';
import { Repository } from 'typeorm';
import { AssetEntity } from '@/modules/market-data/entities/asset.entity';

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
