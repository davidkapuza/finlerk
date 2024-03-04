import Alpaca from '@alpacahq/alpaca-trade-api';
import {
  AlpacaBar,
  AlpacaTrade,
} from '@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2';
import { EventEmitterInterface } from '@modules/redis-pub-sub/event/emitter/contract/event-emitter.interface';
import { EVENT_EMITTER_TOKEN } from '@modules/redis-pub-sub/event/emitter/redis.event-emitter';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { NewBar } from './events/new-bar.event';
import { NewTrade } from './events/new-trade.event';
import { catchError, firstValueFrom, timer } from 'rxjs';
import { AxiosError } from 'axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class StocksService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @Inject(EVENT_EMITTER_TOKEN)
    private readonly eventEmitter: EventEmitterInterface,
    private readonly httpService: HttpService,
    @Inject('ALPACA_SDK') private readonly alpaca: Alpaca,
  ) {
    this.connect();
  }
  private readonly logger = new Logger(StocksService.name);
  private websocket = this.alpaca.data_stream_v2;
  private isConnect = false;

  async connect() {
    this.websocket.onConnect(() => {
      this.isConnect = true;
    });
    this.websocket.onError((err) => {
      this.logger.error(err);
      this.isConnect = false;
      this.websocket.disconnect();
    });

    this.websocket.onDisconnect(() => {
      timer(1000).subscribe(() => {
        this.isConnect = false;
        this.connect();
      });
    });
    this.websocket.onStateChange((state) => {
      console.log(state);
    });
    this.websocket.onStockTrade((trade) => {
      this.eventEmitter.emit(NewTrade.name, new NewTrade(trade));
    });
    this.websocket.onStockBar((bar) => {
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
    this.websocket.connect();
  }

  async subscribeForTrades(trades: string[]) {
    if (this.isConnect) this.websocket.subscribeForTrades(trades);
  }

  async subsribeForBars(stocks: string[]) {
    if (this.isConnect) this.websocket.subscribeForBars(stocks);
  }

  async getNews(symbols: string[]) {
    if (!symbols.length) {
      const { most_actives } = await this.mostActive();
      symbols = most_actives.map((s) => s.symbol);
    }
    return this.alpaca.getNews({
      symbols,
    });
  }

  async getLatestTrades(symbols: string[]) {
    if (!symbols.length) {
      const { most_actives } = await this.mostActive();
      symbols = most_actives.map((s) => s.symbol);
    }
    return this.alpaca.getLatestTrades(symbols);
  }

  getLatestBars(symbols: string[]) {
    return this.alpaca.getLatestBars(symbols);
  }

  getLatestQuotes(symbols: string[]) {
    return this.alpaca.getLatestQuotes(symbols);
  }

  async mostActive() {
    const cached = await this.cacheService.get(
      '/v1beta1/screener/stocks/most-actives',
    );

    if (cached) {
      return cached;
    }

    const { data } = await firstValueFrom(
      this.httpService.get('/v1beta1/screener/stocks/most-actives').pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw error;
        }),
      ),
    );

    await this.cacheService.set('/v1beta1/screener/stocks/most-actives', data);
    return data;
  }

  async getTrades(symbol: string) {
    const tradeData: AlpacaTrade[] = [];
    const trades = this.alpaca.getTradesV2(symbol, {
      start: '2024-01-03T00:00:00Z',
      end: new Date().toISOString(),
    });

    for await (const t of trades) {
      tradeData.push(t);
    }

    return tradeData;
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
