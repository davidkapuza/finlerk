export interface EventEmitterInterface {
  emit(eventName: string, data: unknown): void;
}
