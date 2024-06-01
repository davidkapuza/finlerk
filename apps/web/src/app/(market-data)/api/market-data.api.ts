import { Api } from '@/lib/api';
import {
  Asset,
  GetHistoricalSymbolBarsDto,
  NewsResponseType,
  StockBarsResponseType,
} from '@finlerk/shared';

export class MarketDataApi extends Api {
  public async getNews(): Promise<NewsResponseType> {
    return this.get('/api/v1/market-data/news');
  }

  public async assetsFetcher(url): Promise<Asset[]> {
    return this.get(url);
  }

  public async getHistoricalBars({
    url,
    ...params
  }: Omit<
    GetHistoricalSymbolBarsDto & {
      url: string;
    },
    'symbol'
  >): Promise<StockBarsResponseType> {
    const searchParams = new URLSearchParams(params);
    return this.get(`${url}/?${searchParams}`);
  }

  public async getMarketClock() {
    return this.get('/api/v1/market-data/market-clock');
  }
}

export const marketDataApi = new MarketDataApi();
