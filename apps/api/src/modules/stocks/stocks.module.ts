import { Module } from '@nestjs/common';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { StocksGateway } from './stocks.gateway';
import { RedisPubSubModule } from '@modules/redis-pub-sub/redis-pub-sub.module';
import { NewMessageEvent } from './event/new-message.event';

@Module({
  imports: [
    RedisPubSubModule.registerEvents([NewMessageEvent.publishableEventName]),
  ],
  controllers: [StocksController],
  providers: [StocksService, StocksGateway],
})
export class StocksModule {}
