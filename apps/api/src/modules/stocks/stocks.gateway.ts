import { AlpacaBar } from '@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2';
import { PublishableEventInterface } from '@modules/redis-pub-sub/event/emitter/contract/publishable-event.interface';
import {
  EVENT_SUBSCRIBER_TOKEN,
  EventSubscriberInterface,
} from '@modules/redis-pub-sub/event/subscriber/event-subscriber.interface';
import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Observable, from, map } from 'rxjs';
import { type Socket } from 'socket.io';
import { NewTrade } from './events/new-trade.event';
import { StocksService } from './stocks.service';
import { NewBar } from './events/new-bar.event';

export enum WebsocketEventSubscribeList {
  FETCH_STOCK_TRADES = 'fetch-stock-trades',
  STOCK_TRADES_STREAM = 'stock-trades-stream',
  FETCH_STOCK_BARS = 'fetch-stock-bars',
  STOCK_BARS_STREAM = 'stock-bars-stream',
}

@WebSocketGateway({
  pingInterval: 30000,
  pingTimeout: 5000,
  cors: {
    origin: '*',
  },
})
export class StocksGateway {
  constructor(
    @Inject(EVENT_SUBSCRIBER_TOKEN)
    private eventSubscriber: EventSubscriberInterface,
    private readonly stocksService: StocksService,
  ) {}

  @SubscribeMessage(WebsocketEventSubscribeList.FETCH_STOCK_TRADES)
  async streamTrades(
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
    return from(stream$).pipe(
      map((data) => ({
        event,
        data,
      })),
    );
  }

  @SubscribeMessage(WebsocketEventSubscribeList.FETCH_STOCK_BARS)
  async streamBars(
    @ConnectedSocket() client: Socket,
    @MessageBody() stocks: string[],
  ) {
    this.stocksService.subsribeForBars(stocks);
    const stream$ = this.createWebsocketStreamFromEventFactory<AlpacaBar>(
      client,
      this.eventSubscriber,
      NewBar.publishableEventName,
    );
    const event = WebsocketEventSubscribeList.STOCK_BARS_STREAM;
    return from(stream$).pipe(
      map((data: AlpacaBar) => ({
        event,
        data,
      })),
    );
  }

  private createWebsocketStreamFromEventFactory<T>(
    client: Socket,
    eventSubscriber: EventSubscriberInterface,
    eventName: string,
  ): Observable<T> {
    return new Observable((observer) => {
      const dynamicListener = (message: PublishableEventInterface) => {
        observer.next(message as T);
      };
      eventSubscriber.on(eventName, dynamicListener);

      client.on('disconnect', () => {
        eventSubscriber.off(eventName, dynamicListener);
      });
    });
  }
}
