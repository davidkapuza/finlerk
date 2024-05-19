import { ConfigType } from '@/shared/config/config.type';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BrokerApiService } from './broker-api.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<ConfigType>) => ({
        baseURL: configService.getOrThrow('alpaca.broker_api', {
          infer: true,
        }),
        headers: {
          Authorization: `Basic ${configService.getOrThrow(
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
      provide: BrokerApiService,
      useExisting: HttpService,
    },
  ],
  exports: [BrokerApiService],
})
export class BrolerApiModule {}
