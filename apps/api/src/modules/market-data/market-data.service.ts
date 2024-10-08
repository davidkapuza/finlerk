import { BrokerApiService } from '@/modules/alpaca/api/broker-api/broker-api.service';
import { MarketDataApiService } from '@/modules/alpaca/api/market-data-api/market-data-api.service';
import { TradingApiService } from '@/modules/alpaca/api/trading-api/trading-api.service';
import {
  AlpacaSymbolBarsResponseType,
  Asset,
  GetAssetsDto,
  GetHistoricalSymbolBarsDto,
  GetMarketCalendarDto,
  GetNewsDto,
  IPaginationOptions,
  MarketCalendarItemType,
  MostActiveStockSnapshotsResponseType,
  MostActiveStocksResponseType,
  MostActiveStocksSnapshotsResponseType,
  NewsResponseType,
  SymbolDto,
} from '@finlerk/shared';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Cache } from 'cache-manager';
import { formatISO, parseISO, subDays } from 'date-fns';
import { catchError, firstValueFrom } from 'rxjs';
import { AssetsResponseType } from './types/assets-response.type';
import { AssetRepository } from './infrastructure/persistence/asset.repository';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class MarketDataService {
  private readonly logger = new Logger(MarketDataService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    private readonly assetRepository: AssetRepository,
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
    return this.assetRepository.findManyWithPagination({
      paginationOptions,
      globalFilter,
    });
  }

  @Cron(CronExpression.EVERY_WEEK)
  async fetchAndUpsertAssets(getAssetsDto?: GetAssetsDto): Promise<void> {
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
    await this.assetRepository.upsertAssets(data);
  }

  async mostActives(): Promise<MostActiveStocksResponseType> {
    const cached: MostActiveStocksResponseType = await this.cacheService.get(
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
  }: GetHistoricalSymbolBarsDto): Promise<AlpacaSymbolBarsResponseType> {
    const marketOpenTime = await this.getUSMarketOpenTime(parseISO(start));

    const { data } = await firstValueFrom(
      this.marketDataApi
        .get<AlpacaSymbolBarsResponseType>(`/v2/stocks/${symbol}/bars`, {
          params: {
            start: marketOpenTime,
            ...params,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw error;
          }),
        ),
    );
    return data;
  }

  async stockSnapshot(query: SymbolDto) {
    const { data } = await firstValueFrom(
      this.marketDataApi
        .get<MostActiveStockSnapshotsResponseType>(
          `/v2/stocks/${query.symbol}/snapshot`,
          {
            params: {
              feed: 'iex',
            },
          },
        )
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw error;
          }),
        ),
    );
    return data;
  }

  async mostActiveStocksSnapshots() {
    const mostActive = await this.mostActives();

    const { data } = await firstValueFrom(
      this.marketDataApi
        .get<MostActiveStocksSnapshotsResponseType>(`/v2/stocks/snapshots`, {
          params: {
            symbols: mostActive.most_actives
              .map((stock) => stock.symbol)
              .join(','),
            // TODO Change feed based on user subscription
            feed: 'iex',
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw error;
          }),
        ),
    );
    return data;
  }

  private async getUSMarketOpenTime(start: Date): Promise<string> {
    const marketCalendar = await this.getMarketCalendar({
      start: formatISO(subDays(start, 7)),
      end: formatISO(start),
    });

    let openDate = marketCalendar.at(-1),
      bestDiff = -new Date(0, 0, 0).valueOf(),
      currDiff = 0;

    for (let i = 0; i < marketCalendar.length; i++) {
      currDiff = Math.abs(Date.parse(marketCalendar[i].date) - +start);
      if (currDiff < bestDiff) {
        openDate = marketCalendar[i];
        bestDiff = currDiff;
      }
    }

    return `${openDate.date}T${openDate.open}:00-04:00`;
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
