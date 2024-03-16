export const EVENT_SUBSCRIBER_TOKEN = 'EVENT_SUBSCRIBER_TOKEN';

export interface EventSubscriberInterface {
  on(name: string, listener): void;

  off(name: string, listener): void;
}
