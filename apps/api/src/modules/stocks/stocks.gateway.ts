import {
  EVENT_SUBSCRIBER_TOKEN,
  EventSubscriberInterface,
} from '@modules/redis-pub-sub/event/subscriber/event-subscriber.interface';
import { Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Observable, from, map } from 'rxjs';
import { NewMessageEvent } from './event/new-message.event';
import { PublishableEventInterface } from '@modules/redis-pub-sub/event/emitter/contract/publishable-event.interface';
import { type Socket } from 'socket.io';

export enum WebsocketEventSubscribeList {
  FETCH_EVENTS_MESSAGES = 'fetch-events-messages',
  EVENTS_MESSAGES_STREAM = 'events-messages-stream',
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
  ) {}

  @SubscribeMessage(WebsocketEventSubscribeList.FETCH_EVENTS_MESSAGES)
  async streamMessagesData(@ConnectedSocket() client: Socket) {
    const stream$ = this.createWebsocketStreamFromEventFactory(
      client,
      this.eventSubscriber,
      NewMessageEvent.publishableEventName,
    );
    const event = WebsocketEventSubscribeList.EVENTS_MESSAGES_STREAM;
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
