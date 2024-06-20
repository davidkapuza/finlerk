import { BrokerApiModule } from '@/modules/alpaca/api/broker-api/broker-api.module';
import { MarketDataApiModule } from '@/modules/alpaca/api/market-data-api/market-data-api.module';
import { TradingApiModule } from '@/modules/alpaca/api/trading-api/trading-api.module';
import { Module } from '@nestjs/common';
import { RelationalMarketDataPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { MarketDataController } from './market-data.controller';
import { MarketDataService } from './market-data.service';

@Module({
  imports: [
    MarketDataApiModule,
    TradingApiModule,
    BrokerApiModule,
    RelationalMarketDataPersistenceModule,
  ],
  providers: [MarketDataService],
  controllers: [MarketDataController],
  exports: [MarketDataService, RelationalMarketDataPersistenceModule],
})
export class MarketDataModule {}
