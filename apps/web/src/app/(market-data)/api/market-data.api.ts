import { Api } from '@/lib/api';
import { Asset, NewsResponseType } from '@qbick/shared';

export class MarketDataApi extends Api {
  /**
   * Get market data news.
   *
   */
  public getNews = () => {
    return this.get<NewsResponseType>('/api/v1/market-data/news').then(
      this.success,
    );
  };

  /**
   * Get market data assets.
   *
   */
  public assetsFetcher = (url) => {
    return this.get<Array<Asset>>(url).then(this.success);
  };
}

export const marketDataApi = new MarketDataApi();
