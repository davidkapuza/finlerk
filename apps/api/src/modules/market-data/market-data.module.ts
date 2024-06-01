import { BrolerApiModule } from '@/modules/alpaca/api/broker-api/broker-api.module';
import { MarketDataApiModule } from '@/modules/alpaca/api/market-data-api/market-data-api.module';
import { TradingApiModule } from '@/modules/alpaca/api/trading-api/trading-api.module';
import { RedisPubSubModule } from '@/modules/redis-pub-sub/redis-pub-sub.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewBar } from './events/new-bar.event';
import { NewTrade } from './events/new-trade.event';
import { MarketDataController } from './market-data.controller';
import { MarketDataGateway } from './market-data.gateway';
import { MarketDataService } from './market-data.service';
import { MarketDataRepository } from './repository/market-data.repository';
import { AssetEntity } from './entities/asset.entity';

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
  providers: [MarketDataService, MarketDataGateway, MarketDataRepository],
  controllers: [MarketDataController],
  exports: [MarketDataService],
})
export class MarketDataModule {}
