import { AssetMapper } from '@/market-data/mappers/asset.mapper';
import { MarketDataService } from '@/market-data/market-data.service';
import { AssetEntity } from '@/shared/entities/asset.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AssetStatusEnum } from '@qbick/shared';
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
