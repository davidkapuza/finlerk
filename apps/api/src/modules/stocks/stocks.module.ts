import { AlpacaModule } from '@modules/alpaca/alpaca.module';
import { RedisPubSubModule } from '@modules/redis-pub-sub/redis-pub-sub.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigType } from '@shared/config/config.type';
import { NewBar } from './events/new-bar.event';
import { NewTrade } from './events/new-trade.event';
import { StocksController } from './stocks.controller';
import { StocksGateway } from './stocks.gateway';
import { StocksService } from './stocks.service';
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
        baseURL: configService.getOrThrow('alpaca.url', {
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
  providers: [StocksService, StocksGateway],
  controllers: [StocksController],
})
export class StocksModule {}
