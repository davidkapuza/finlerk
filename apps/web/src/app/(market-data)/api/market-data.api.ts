import { Api } from '@/lib/api';
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
  public getNews() {
    return this.get<NewsResponseType>('/api/v1/market-data/news').then(
      this.success,
    );
  }

  /**
   * Get market data assets.
   *
   */
  public assetsFetcher(url) {
    return this.get<Array<Asset>>(url).then(this.success);
  }

  /**
   * Get market data assets.
   *
   */
  public getHistoricalBars(params: GetBarsDto): Promise<StockBarsResponseType> {
    const searchParams = new URLSearchParams({ ...params });
    return this.get<StockBarsResponseType>(
      `/api/v1/market-data/stocks-bars?${searchParams}`,
    ).then(this.success);
  }
}

export const marketDataApi = new MarketDataApi();
