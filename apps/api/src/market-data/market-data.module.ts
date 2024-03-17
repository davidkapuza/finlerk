import { AlpacaModule } from '@/alpaca/alpaca.module';
import { RedisPubSubModule } from '@/redis-pub-sub/redis-pub-sub.module';
import { ConfigType } from '@/shared/config/config.type';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NewBar } from './events/new-bar.event';
import { NewTrade } from './events/new-trade.event';
import { MarketDataController } from './market-data.controller';
import { MarketDataGateway } from './market-data.gateway';
import { MarketDataService } from './market-data.service';
@Module({
  imports: [
    RedisPubSubModule.registerEvents([
      NewTrade.publishableEventName,
      NewBar.publishableEventName,
    ]),
    AlpacaModule,
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
  providers: [MarketDataService, MarketDataGateway],
  controllers: [MarketDataController],
})
export class MarketDataModule {}
