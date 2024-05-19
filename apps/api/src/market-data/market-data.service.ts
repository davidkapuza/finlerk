import { BrokerApiService } from '@/alpaca/api/broker-api/broker-api.service';
import { MarketDataApiService } from '@/alpaca/api/market-data-api/market-data-api.service';
import { TradingApiService } from '@/alpaca/api/trading-api/trading-api.service';
import {
  Asset,
  GetAssetsDto,
  GetHistoricalSymbolBarsDto,
  GetMarketCalendarDto,
  GetNewsDto,
  IPaginationOptions,
  MarketCalendarItemType,
  NewsResponseType,
  StockBarsResponseType,
} from '@finlerk/shared';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Cache } from 'cache-manager';
import { formatISO, parseISO, subDays } from 'date-fns';
import { catchError, firstValueFrom, map } from 'rxjs';
import { MarketDataRepositoryInterface } from './repository/market-data-repository.interface';
import { stockBarsResponseTransformer } from './transformers/stock-bars-response.transformer';
import { AlpacaSymbolBarsResponseType } from './types/alpaca-symbol-bars-response.type';
import { AssetsResponseType } from './types/assets-response.type';

@Injectable()
export class MarketDataService {
  private readonly logger = new Logger(MarketDataService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    // @Inject(EVENT_EMITTER_TOKEN)
    // private readonly eventEmitter: EventEmitterInterface,
    @Inject('MarketDataRepositoryInterface')
    private readonly marketDataRepository: MarketDataRepositoryInterface,
    private readonly marketDataApi: MarketDataApiService,
    private readonly tradingApi: TradingApiService,
    private readonly brokerApi: BrokerApiService,
  ) {}

  async getNews(getNewsDto: GetNewsDto): Promise<NewsResponseType> {
    if (!getNewsDto.symbols) {
      const { most_actives } = await this.mostActives();
      getNewsDto.symbols = most_actives.map((s) => s.symbol).join(',');
    }
    const { data } = await firstValueFrom(
      this.marketDataApi
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

  async findManyWithPagination({
    paginationOptions,
    globalFilter,
  }: {
    paginationOptions: IPaginationOptions;
    globalFilter?: string;
  }): Promise<Asset[]> {
    return this.marketDataRepository.findManyWithPagination({
      paginationOptions,
      globalFilter,
    });
  }

  async getAssets(getAssetsDto?: GetAssetsDto): Promise<AssetsResponseType> {
    const { data } = await firstValueFrom(
      this.tradingApi
        .get<AssetsResponseType>('/v2/assets', {
          params: {
            ...getAssetsDto,
            attributes: getAssetsDto?.attributes?.join(','),
          },
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
      this.marketDataApi.get('/v1beta1/screener/stocks/most-actives').pipe(
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

  async getHistoricalBars({
    symbol,
    start,
    ...params
  }: GetHistoricalSymbolBarsDto): Promise<StockBarsResponseType> {
    const marketOpenedStartDay = await this.getMarketOpenedStartDay(
      parseISO(start),
    );

    const { data } = await firstValueFrom(
      this.marketDataApi
        .get<AlpacaSymbolBarsResponseType>(`/v2/stocks/${symbol}/bars`, {
          params: {
            start: formatISO(marketOpenedStartDay),
            ...params,
          },
        })
        .pipe(
          map(stockBarsResponseTransformer),
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw error;
          }),
        ),
    );
    return data;
  }

  private async getMarketOpenedStartDay(start: Date): Promise<Date> {
    const marketCalendar = await this.getMarketCalendar({
      start: formatISO(subDays(start, 7)),
      end: formatISO(start),
    });

    let bestDate = marketCalendar.at(-1),
      bestDiff = -new Date(0, 0, 0).valueOf(),
      currDiff = 0;

    for (let i = 0; i < marketCalendar.length; i++) {
      currDiff = Math.abs(Date.parse(marketCalendar[i].date) - +start);
      if (currDiff < bestDiff) {
        bestDate = marketCalendar[i];
        bestDiff = currDiff;
      }
    }

    return new Date(`${bestDate.date}T${bestDate.open}`);
  }

  async getMarketClock() {
    const { data } = await firstValueFrom(this.brokerApi.get('/v1/clock'));
    return data;
  }

  async getMarketCalendar(query: GetMarketCalendarDto) {
    const searchParams = new URLSearchParams(query as Record<string, string>);
    const cached = await this.cacheService.get<MarketCalendarItemType[]>(
      `/v1/calendar?${searchParams}`,
    );

    if (cached) return cached;

    const { data } = await firstValueFrom(
      this.brokerApi.get<MarketCalendarItemType[]>('/v1/calendar', {
        params: query,
      }),
    );

    await this.cacheService.set(`/v1/calendar?${searchParams}`, data, {
      ttl: 3600 * 24,
    });

    return data;
  }
}
