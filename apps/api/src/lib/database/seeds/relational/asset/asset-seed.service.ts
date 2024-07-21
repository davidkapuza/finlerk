import { MarketDataService } from '@/modules/market-data/market-data.service';
import { AssetStatusEnum } from '@finlerk/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AssetSeedService {
  constructor(private readonly marketDataService: MarketDataService) {}

  async run() {
    await this.marketDataService.fetchAndUpsertAssets({
      status: AssetStatusEnum.active,
    });
  }
}
