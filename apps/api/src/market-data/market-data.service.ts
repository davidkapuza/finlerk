import { ConfigType } from '@/shared/config/config.type';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Asset,
  GetAssetsDto,
  GetBarsDto,
  GetNewsDto,
  IPaginationOptions,
  NewsResponseType,
  StockBarsResponseType,
} from '@finlerk/shared';
import { AxiosError } from 'axios';
import { Cache } from 'cache-manager';
import { catchError, firstValueFrom, map } from 'rxjs';
import { stockBarsResponseTransformer } from './transformers/stock-bars-response.transformer';
import { AlpacaBarsResponseType } from './types/alpaca-bars-response.type';
import { AssetsResponseType } from './types/assets-response.type';
import { MarketDataRepositoryInterface } from './repository/market-data-repository.interface';

@Injectable()
export class MarketDataService {
  private readonly logger = new Logger(MarketDataService.name);
  // private isConnect = false;
  constructor(
    @Inject(CACHE_MANAGER) private cacheService: Cache,
    // @Inject(EVENT_EMITTER_TOKEN)
    // private readonly eventEmitter: EventEmitterInterface,
    @Inject('MarketDataRepositoryInterface')
    private readonly marketDataRepository: MarketDataRepositoryInterface,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService<ConfigType>,
  ) {}

  async getNews(getNewsDto: GetNewsDto): Promise<NewsResponseType> {
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
      this.httpService
        .get<AssetsResponseType>('/v2/assets', {
          params: {
            ...getAssetsDto,
            attributes: getAssetsDto?.attributes?.join(','),
          },
          baseURL: this.configService.getOrThrow('alpaca.trading_api', {
            infer: true,
          }),
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
