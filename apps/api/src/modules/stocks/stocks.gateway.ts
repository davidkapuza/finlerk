import { PublishableEventInterface } from '@modules/redis-pub-sub/event/emitter/contract/publishable-event.interface';
import {
  EVENT_SUBSCRIBER_TOKEN,
  EventSubscriberInterface,
} from '@modules/redis-pub-sub/event/subscriber/event-subscriber.interface';
import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Observable, from, map } from 'rxjs';
import { type Socket } from 'socket.io';
import { NewTrade } from './event/new-trade.event';
import { StocksService } from './stocks.service';

export enum WebsocketEventSubscribeList {
  FETCH_STOCK_TRADES = 'fetch-stock-trades',
  STOCK_TRADES_STREAM = 'stock-trades-stream',
}

@WebSocketGateway({
  pingInterval: 30000,
  pingTimeout: 5000,
  cors: {
    origin: '*',
  },
})
export class StocksGateway implements OnGatewayInit, OnGatewayDisconnect {
  constructor(
    @Inject(EVENT_SUBSCRIBER_TOKEN)
    private eventSubscriber: EventSubscriberInterface,
    private readonly stocksService: StocksService,
  ) {}

  handleDisconnect() {
    this.stocksService.disconnect();
  }

  afterInit() {
    this.stocksService.connect();
  }

  @SubscribeMessage(WebsocketEventSubscribeList.FETCH_STOCK_TRADES)
  async streamMessagesData(
    @ConnectedSocket() client: Socket,
    @MessageBody() stocks: string[],
  ) {
    this.stocksService.subscribeForTrades(stocks);
    const stream$ = this.createWebsocketStreamFromEventFactory(
      client,
      this.eventSubscriber,
      NewTrade.publishableEventName,
    );
    const event = WebsocketEventSubscribeList.STOCK_TRADES_STREAM;
    return from(stream$).pipe(map((data) => ({ event, data })));
  }

  private createWebsocketStreamFromEventFactory(
    client: Socket,
    eventSubscriber: EventSubscriberInterface,
    eventName: string,
  ): Observable<unknown> {
    return new Observable((observer) => {
      const dynamicListener = (message: PublishableEventInterface) => {
        observer.next(message);
      };

      eventSubscriber.on(eventName, dynamicListener);

      client.on('disconnect', () => {
        eventSubscriber.off(eventName, dynamicListener);
      });
    });
  }
}
