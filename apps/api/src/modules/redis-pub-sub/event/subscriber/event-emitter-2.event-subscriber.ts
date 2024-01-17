import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventSubscriberInterface } from './event-subscriber.interface';

export class EventEmitter2EventSubscriber implements EventSubscriberInterface {
  constructor(private eventEmitter: EventEmitter2) {}

  on(name: string, listener): void {
    console.log('subcsriber', name, listener);
    this.eventEmitter.on(name, listener);
  }

  off(name: string, listener): void {
    this.eventEmitter.removeListener(name, listener);
  }
}
