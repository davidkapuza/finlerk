import { BrolerApiModule } from '@/modules/alpaca/api/broker-api/broker-api.module';
import { MarketDataApiModule } from '@/modules/alpaca/api/market-data-api/market-data-api.module';
import { TradingApiModule } from '@/modules/alpaca/api/trading-api/trading-api.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { AssetEntity } from './entities/asset.entity';
import { MarketDataController } from './market-data.controller';
import { MarketDataService } from './market-data.service';
import { MarketDataRepository } from './repository/market-data.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([AssetEntity]),
    MarketDataApiModule,
    TradingApiModule,
    BrolerApiModule,
    AuthModule,
  ],
  providers: [MarketDataService, MarketDataRepository],
  controllers: [MarketDataController],
  exports: [MarketDataService],
})
export class MarketDataModule {}
