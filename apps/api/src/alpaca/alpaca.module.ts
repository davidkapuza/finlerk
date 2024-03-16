import Alpaca from '@alpacahq/alpaca-trade-api';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    {
      provide: 'ALPACA_SDK',
      useFactory: (configService: ConfigService) =>
        new Alpaca({
          keyId: configService.getOrThrow('alpaca.token', {
            infer: true,
          }),
          secretKey: configService.getOrThrow('alpaca.secret', {
            infer: true,
          }),
        }),
      inject: [ConfigService],
    },
  ],
  exports: ['ALPACA_SDK'],
})
export class AlpacaModule {}
