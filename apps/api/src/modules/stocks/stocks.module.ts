import { RedisPubSubModule } from '@modules/redis-pub-sub/redis-pub-sub.module';
import { Module } from '@nestjs/common';
import { NewTrade } from './event/new-trade.event';
import { StocksGateway } from './stocks.gateway';
import { StocksService } from './stocks.service';
import { AlpacaModule } from '@modules/alpaca/alpaca.module';
import { StocksController } from './stocks.controller';

@Module({
  imports: [
    RedisPubSubModule.registerEvents([NewTrade.publishableEventName]),
    AlpacaModule,
  ],
  providers: [StocksService, StocksGateway],
  controllers: [StocksController],
})
export class StocksModule {}
