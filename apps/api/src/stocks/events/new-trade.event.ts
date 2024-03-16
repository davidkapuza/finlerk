import { PublishableEventInterface } from '@/redis-pub-sub/event/emitter/contract/publishable-event.interface';
import { AlpacaTrade } from '@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2';

export class NewTrade implements PublishableEventInterface {
  static publishableEventName = 'events:new-trade';

  publishableEventName = NewTrade.publishableEventName;

  constructor(public readonly trade: AlpacaTrade) {}
}
