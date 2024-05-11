import { Api } from '@/shared/api';
import { unauthorizedInterceptor } from '@/shared/decorators';
import {
  Asset,
  GetBarsDto,
  NewsResponseType,
  StockBarsResponseType,
} from '@finlerk/shared';

export class MarketDataApi extends Api {
  constructor() {
    super();
    this.getNews = this.getNews.bind(this);
    this.assetsFetcher = this.assetsFetcher.bind(this);
    this.getHistoricalBars = this.getHistoricalBars.bind(this);
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
  @unauthorizedInterceptor
  public assetsFetcher(url): Promise<Asset[]> {
    return this.get(url).then((res) => res.json());
  }

  /**
   * Get market data assets.
   *
   */
  public getHistoricalBars(params: GetBarsDto): Promise<StockBarsResponseType> {
    const searchParams = new URLSearchParams({ ...params });
    return this.get(`/api/v1/market-data/stocks-bars?${searchParams}`).then(
      (res) => res.json(),
    );
  }
}

export const marketDataApi = new MarketDataApi();
