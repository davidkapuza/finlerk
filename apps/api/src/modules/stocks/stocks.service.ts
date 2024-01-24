import Alpaca from '@alpacahq/alpaca-trade-api';
import { AlpacaBar } from '@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2';
import { EventEmitterInterface } from '@modules/redis-pub-sub/event/emitter/contract/event-emitter.interface';
import { EVENT_EMITTER_TOKEN } from '@modules/redis-pub-sub/event/emitter/redis.event-emitter';
import { Inject, Injectable } from '@nestjs/common';
import { NewTrade } from './events/new-trade.event';
import { NewBar } from './events/new-bar.event';

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
      console.log('Error', err);
      this.websocket.connect();
    });
    this.websocket.onStockTrade((trade) => {
      console.log('trade > ', trade);
      this.eventEmitter.emit(NewTrade.name, new NewTrade(trade));
    });
    this.websocket.onStockBar((bar) => {
      console.log('bar > ', bar);
      this.eventEmitter.emit(
        NewBar.name,
        new NewBar({
          time: Date.parse(bar.Timestamp) / 1000,
          open: bar.OpenPrice,
          high: bar.HighPrice,
          low: bar.LowPrice,
          close: bar.ClosePrice,
          volume: bar.Volume,
        }),
      );
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
    if (this.isConnected) this.websocket.subscribeForTrades(trades);
  }

  async subsribeForBars(stocks: string[]) {
    if (this.isConnected) this.websocket.subscribeForBars(stocks);
  }

  getNews(symbols) {
    return this.alpaca.getNews({
      symbols,
    });
  }

  getLatestTrades(symbols: string[]) {
    return this.alpaca.getLatestTrades(symbols);
  }

  async getHistoricalBars(symbol: string) {
    const bars = this.alpaca.getBarsV2(symbol, {
      timeframe: '1Min',
    });

    const barsData: AlpacaBar[] = [];
    for await (const bar of bars) {
      barsData.push(bar);
    }
    return barsData.map((bar) => ({
      time: Date.parse(bar.Timestamp) / 1000,
      open: bar.OpenPrice,
      high: bar.HighPrice,
      low: bar.LowPrice,
      close: bar.ClosePrice,
      volume: bar.Volume,
    }));
  }
}
