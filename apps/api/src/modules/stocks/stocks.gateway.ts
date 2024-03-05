import {
  AlpacaBar,
  AlpacaTrade,
} from '@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2';
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
import { SubscribableStreamsEnum } from './enums/subscribable-streams.enum';
import { NewBar } from './events/new-bar.event';
import { NewTrade } from './events/new-trade.event';
import { StocksService } from './stocks.service';

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

  @SubscribeMessage(SubscribableStreamsEnum.stockTrades)
  async streamTrades(
    @ConnectedSocket() client: Socket,
    @MessageBody() stocks: string[],
  ) {
    this.stocksService.subscribeForTrades(stocks);
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
    @MessageBody() stocks: string[],
  ) {
    this.stocksService.subsribeForBars(stocks);
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
