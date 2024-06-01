import { ConfigType } from '@/lib/config/config.type';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TradingApiService } from './trading-api.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<ConfigType>) => ({
        baseURL: configService.getOrThrow('alpaca.trading_api', {
          infer: true,
        }),
        headers: {
          'APCA-API-KEY-ID': configService.getOrThrow('alpaca.token', {
            infer: true,
          }),
          'APCA-API-SECRET-KEY': configService.getOrThrow('alpaca.secret', {
            infer: true,
          }),
          authorization: `Basic ${configService.getOrThrow(
            'alpaca.broker_api_auth_header',
            { infer: true },
          )}`,
          Accept: 'application/json',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: TradingApiService,
      useExisting: HttpService,
    },
  ],
  exports: [TradingApiService],
})
export class TradingApiModule {}
