import { Api } from '@/shared/api';
import { unauthorizedInterceptor, DecorateAll } from '@/shared/decorators';
import {
  Asset,
  GetHistoricalSymbolBarsDto,
  GetMarketCalendarDto,
  MarketCalendarItemType,
  NewsResponseType,
  StockBarsResponseType,
} from '@finlerk/shared';

@DecorateAll(unauthorizedInterceptor)
export class MarketDataApi extends Api {
  constructor() {
    super();
    this.getNews = this.getNews.bind(this);
    this.assetsFetcher = this.assetsFetcher.bind(this);
    this.getHistoricalBars = this.getHistoricalBars.bind(this);
    this.getMarketClock = this.getMarketClock.bind(this);
  }
  /**
   * Get market data news.
   *
   */
  public getNews(): Promise<NewsResponseType> {
    return this.get('/api/v1/market-data/news').then((res) => res.json());
  }

  /**
   * Get market data assets.
   *
   */
  public assetsFetcher(url): Promise<Asset[]> {
    return this.get(url).then((res) => res.json());
  }

  /**
   * Get market data assets.
   *
   */
  public getHistoricalBars({
    url,
    ...params
  }: Omit<
    GetHistoricalSymbolBarsDto & {
      url: string;
    },
    'symbol'
  >): Promise<StockBarsResponseType> {
    const searchParams = new URLSearchParams(params);
    return this.get(`${url}/?${searchParams}`).then((res) => res.json());
  }

  public getMarketClock() {
    return this.get('/api/v1/market-data/market-clock').then((res) =>
      res.json(),
    );
  }

  public getMarketCalendar(
    query?: GetMarketCalendarDto,
  ): Promise<MarketCalendarItemType[]> {
    const searchParams = new URLSearchParams(query as Record<string, string>);
    return this.get(`/api/v1/market-data/market-calendar?${searchParams}`).then(
      (res) => res.json(),
    );
  }
}

export const marketDataApi = new MarketDataApi();
