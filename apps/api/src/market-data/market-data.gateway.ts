import { PublishableEventInterface } from '@/redis-pub-sub/event/emitter/contract/publishable-event.interface';
import {
  EVENT_SUBSCRIBER_TOKEN,
  EventSubscriberInterface,
} from '@/redis-pub-sub/event/subscriber/event-subscriber.interface';
import {
  AlpacaBar,
  AlpacaTrade,
} from '@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2';
import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Observable, from, map } from 'rxjs';
import { type Socket } from 'socket.io';
import { NewBar } from './events/new-bar.event';
import { NewTrade } from './events/new-trade.event';
import { SubscribableStreamsEnum } from '@qbick/shared';

@WebSocketGateway({
  pingInterval: 30000,
  pingTimeout: 5000,
  cors: {
    origin: '*',
  },
})
export class MarketDataGateway {
  constructor(
    @Inject(EVENT_SUBSCRIBER_TOKEN)
    private eventSubscriber: EventSubscriberInterface, // private readonly marketDataService: MarketDataService,
  ) {}

  @SubscribeMessage(SubscribableStreamsEnum.stockTrades)
  async streamTrades(
    @ConnectedSocket() client: Socket,
    // @MessageBody() stocks: string[],
  ) {
    // this.marketDataService.subscribeForTrades(stocks);
    const stream$ = this.createWebsocketStreamFromEventFactory<AlpacaTrade>(
      client,
      this.eventSubscriber,
      NewTrade.publishableEventName,
    );

    return from(stream$).pipe(
      map((data) => ({
        event: NewTrade.publishableEventName,
        data,
      })),
    );
  }

  @SubscribeMessage(SubscribableStreamsEnum.stockBars)
  async streamBars(
    @ConnectedSocket() client: Socket,
    // @MessageBody() stocks: string[],
  ) {
    // this.marketDataService.subsribeForBars(stocks);
    const stream$ = this.createWebsocketStreamFromEventFactory<AlpacaBar>(
      client,
      this.eventSubscriber,
      NewBar.publishableEventName,
    );
    return from(stream$).pipe(
      map((data: AlpacaBar) => ({
        event: NewBar.publishableEventName,
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
