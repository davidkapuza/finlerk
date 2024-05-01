import { ConfigType } from '@/shared/config/config.type';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MarketDataController } from './market-data.controller';
import { MarketDataGateway } from './market-data.gateway';
import { MarketDataService } from './market-data.service';
import { RedisPubSubModule } from '@/redis-pub-sub/redis-pub-sub.module';
import { NewTrade } from './events/new-trade.event';
import { NewBar } from './events/new-bar.event';
import { MarketDataRepository } from './repository/market-data.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetEntity } from '@/shared/entities/asset.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([AssetEntity]),
    RedisPubSubModule.registerEvents([
      NewTrade.publishableEventName,
      NewBar.publishableEventName,
    ]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<ConfigType>) => ({
        baseURL: configService.getOrThrow('alpaca.market_data_api', {
          infer: true,
        }),
        headers: {
          'APCA-API-KEY-ID': configService.getOrThrow('alpaca.token', {
            infer: true,
          }),
          'APCA-API-SECRET-KEY': configService.getOrThrow('alpaca.secret', {
            infer: true,
          }),
          Accept: 'application/json',
        },
      }),
      inject: [ConfigService],
    }),
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
