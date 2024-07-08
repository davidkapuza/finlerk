import { baseUrl } from '@/shared/api';
import { createJsonQuery } from '@/shared/lib/fetch';
import {
  Asset,
  GetHistoricalSymbolBarsDto,
  InfinityPaginationResponseDto,
  NewsResponseType,
  StockBarsResponseType,
} from '@finlerk/shared';

export async function newsQuery() {
  return createJsonQuery<NewsResponseType>({
    request: {
      url: baseUrl('/v1/market-data/news'),
      method: 'GET',
      withToken: true,
    },
  });
}

export async function infiniteAssetsQuery(params: {
  pageIndex: number;
  pageSize: number;
  globalFilter: string;
}) {
  return createJsonQuery<InfinityPaginationResponseDto<Asset>>({
    request: {
      url: baseUrl('/v1/market-data/assets'),
      method: 'GET',
      withToken: true,
      query: {
        page: params.pageIndex + 1,
        limit: params.pageSize,
        globalFilter: params.globalFilter,
      },
    },
  });
}

export async function historicalBarsQuery({
  query: { symbol, ...query },
}: {
  query: GetHistoricalSymbolBarsDto;
}) {
  return createJsonQuery<StockBarsResponseType>({
    request: {
      url: baseUrl(`/v1/market-data/historical-bars/${symbol}`),
      method: 'GET',
      withToken: true,
      query: query,
    },
  });
}
