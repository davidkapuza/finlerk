import { BrolerApiModule } from '@/alpaca/api/broker-api/broker-api.module';
import { MarketDataApiModule } from '@/alpaca/api/market-data-api/market-data-api.module';
import { TradingApiModule } from '@/alpaca/api/trading-api/trading-api.module';
import { RedisPubSubModule } from '@/redis-pub-sub/redis-pub-sub.module';
import { AssetEntity } from '@/shared/entities/asset.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewBar } from './events/new-bar.event';
import { NewTrade } from './events/new-trade.event';
import { MarketDataController } from './market-data.controller';
import { MarketDataGateway } from './market-data.gateway';
import { MarketDataService } from './market-data.service';
import { MarketDataRepository } from './repository/market-data.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssetEntity]),
    RedisPubSubModule.registerEvents([
      NewTrade.publishableEventName,
      NewBar.publishableEventName,
    ]),
    MarketDataApiModule,
    TradingApiModule,
    BrolerApiModule,
  ],
  providers: [
    MarketDataService,
    MarketDataGateway,
    {
      provide: 'MarketDataRepositoryInterface',
      useClass: MarketDataRepository,
    },
  ],
  controllers: [MarketDataController],
  exports: [
    MarketDataService,
    {
      provide: 'MarketDataRepositoryInterface',
      useClass: MarketDataRepository,
    },
  ],
})
export class MarketDataModule {}
