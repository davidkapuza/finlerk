import { EventEmitterInterface } from '@/redis-pub-sub/event/emitter/contract/event-emitter.interface';
import { EVENT_EMITTER_TOKEN } from '@/redis-pub-sub/event/emitter/redis.event-emitter';
import Alpaca from '@alpacahq/alpaca-trade-api';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Cache } from 'cache-manager';
import { catchError, firstValueFrom, map, timer } from 'rxjs';
import { GetBarsDto } from './dtos/get-bars.dto';
import { GetNewsDto } from './dtos/get-news.dto';
import { NewBar } from './events/new-bar.event';
import { NewTrade } from './events/new-trade.event';
import { AlpacaBarsResponseType } from './types/alpaca-bars-response.type';
import { stockBarsResponseTransformer } from './transformers/stock-bars-response.transformer';
import { StockBarsResponseType } from '@qbick/shared';

@Injectable()
export class MarketDataService {
  private readonly logger = new Logger(MarketDataService.name);
  private websocket = this.alpaca.data_stream_v2;
  private isConnect = false;
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    @Inject(EVENT_EMITTER_TOKEN)
    private readonly eventEmitter: EventEmitterInterface,
    private readonly httpService: HttpService,
    @Inject('ALPACA_SDK') private readonly alpaca: Alpaca,
  ) {
    this.connect();
  }

  connect() {
    this.websocket.onConnect(() => {
      this.isConnect = true;
    });
    this.websocket.onError((err) => {
      this.logger.error(err);
      this.isConnect = false;
      this.websocket.disconnect();
    });

    this.websocket.onDisconnect(() => {
      timer(5000).subscribe(() => {
        this.isConnect = false;
        this.websocket.connect();
      });
    });
    this.websocket.onStateChange((state) => {
      this.logger.log(state);
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

  async getNews(getNewsDto: GetNewsDto) {
    if (!getNewsDto.symbols) {
      const { most_actives } = await this.mostActives();
      getNewsDto.symbols = most_actives.map((s) => s.symbol).join(',');
    }
    const { data } = await firstValueFrom(
      this.httpService
        .get('/v1beta1/news', {
          params: getNewsDto,
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw error;
          }),
        ),
    );
    return data;
  }

  async mostActives() {
    const cached = await this.cacheService.get(
      '/v1beta1/screener/stocks/most-actives',
    );

    if (cached) return cached;

    const { data } = await firstValueFrom(
      this.httpService.get('/v1beta1/screener/stocks/most-actives').pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw error;
        }),
      ),
    );

    await this.cacheService.set('/v1beta1/screener/stocks/most-actives', data, {
      ttl: 60 * 60,
    });
    return data;
  }

  async getStocksBars(params: GetBarsDto): Promise<StockBarsResponseType> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<AlpacaBarsResponseType>('/v2/stocks/bars', {
          params,
        })
        .pipe(
          map(stockBarsResponseTransformer),
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw error;
          }),
        ),
    );
    return data;
  }
}
