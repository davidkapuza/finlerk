import Alpaca from '@alpacahq/alpaca-trade-api';
import { EventEmitterInterface } from '@modules/redis-pub-sub/event/emitter/contract/event-emitter.interface';
import { EVENT_EMITTER_TOKEN } from '@modules/redis-pub-sub/event/emitter/redis.event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { NewTrade } from './event/new-trade.event';

@Injectable()
export class StocksService {
  constructor(
    @Inject('ALPACA_SDK') private readonly alpaca: Alpaca,
    @Inject(EVENT_EMITTER_TOKEN)
    private readonly eventEmitter: EventEmitterInterface,
  ) {
    this.websocket.onConnect(() => {
      this.isConnected = true;
    });
    this.websocket.onDisconnect(() => {
      this.isConnected = false;
    });
    this.websocket.onStateChange((status) => {
      console.log('Status:', status);
    });
    this.websocket.onError((err) => {
      console.log('Error:', err);
    });
    this.websocket.onStockTrade((trade) => {
      this.eventEmitter.emit(NewTrade.name, new NewTrade(trade));
    });
  }
  private websocket = this.alpaca.data_stream_v2;
  private isConnected = false;

  async connect() {
    if (!this.isConnected) this.websocket.connect();
  }

  async disconnect() {
    if (this.isConnected) this.websocket.disconnect();
  }

  async subscribeForTrades(trades: string[]) {
    this.websocket.subscribeForTrades(trades);
  }
  getNews(symbols) {
    return this.alpaca.getNews({
      symbols,
    });
  }
}
