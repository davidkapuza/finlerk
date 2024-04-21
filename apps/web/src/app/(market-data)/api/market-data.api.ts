import { Api } from '@/lib/api';
import { NewsResponseType } from '@qbick/shared';
import { cache } from 'react';

export class MarketDataApi extends Api {
  /**
   * Get market data news.
   *
   */
  public getNews = cache(() => {
    return this.get<NewsResponseType>('/api/v1/market-data/news').then(
      this.success,
    );
  });
}

export const marketDataApi = new MarketDataApi();
