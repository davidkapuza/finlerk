import { PublishableEventInterface } from '@/modules/redis-pub-sub/event/emitter/contract/publishable-event.interface';

export class NewBar implements PublishableEventInterface {
  static publishableEventName = 'events:new-bar';

  publishableEventName = NewBar.publishableEventName;

  constructor(public readonly bar: unknown) {}
}
