import { Api } from '@/lib/api';
import {
  Asset,
  GetHistoricalSymbolBarsDto,
  NewsResponseType,
  StockBarsResponseType,
} from '@finlerk/shared';

export class MarketDataApi extends Api {
  public async getNews(): Promise<NewsResponseType> {
    return this.get<NewsResponseType>('/api/v1/market-data/news').then(
      (response) => response.data,
    );
  }

  public async assetsFetcher(url: string): Promise<Asset[]> {
    console.log('assetsFetcher', url);
    return this.get<Asset[]>(url).then((response) => response.data);
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
    return this.get<StockBarsResponseType>(url, {
      params,
    }).then((response) => response.data);
  }
}

export const marketDataApi = new MarketDataApi();
