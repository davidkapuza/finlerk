import { auth } from '@/auth';
import { baseUrl } from '@/shared/api';
import { isServer } from '@/shared/constants';
import { FetchApiRecord, createJsonQuery } from '@/shared/lib/fetch';
import {
  Asset,
  GetHistoricalSymbolBarsDto,
  InfinityPaginationResponseDto,
  NewsResponseType,
  StockBarsResponseType,
} from '@finlerk/shared';
import { accessAuthorizationHeader } from '../auth/auth.model';

export async function newsQuery() {
  let authHeader: FetchApiRecord;
  if (isServer) {
    const session = await auth();
    authHeader = { Authorization: `Bearer ${session.token}` };
  } else {
    authHeader = { ...accessAuthorizationHeader() };
  }
  return createJsonQuery<NewsResponseType>({
    request: {
      url: baseUrl('/v1/market-data/news'),
      method: 'GET',
      headers: { ...authHeader },
    },
  });
}

export async function infiniteAssetsQuery(params: {
  pageIndex: number;
  pageSize: number;
  globalFilter: string;
}) {
  let authHeader: FetchApiRecord;
  if (isServer) {
    const session = await auth();
    authHeader = { Authorization: `Bearer ${session.token}` };
  } else {
    authHeader = { ...accessAuthorizationHeader() };
  }
  return createJsonQuery<InfinityPaginationResponseDto<Asset>>({
    request: {
      url: baseUrl('/v1/market-data/assets'),
      method: 'GET',
      headers: { ...authHeader },
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
  let authHeader: FetchApiRecord;
  if (isServer) {
    const session = await auth();
    authHeader = { Authorization: `Bearer ${session.token}` };
  } else {
    authHeader = { ...accessAuthorizationHeader() };
  }
  return createJsonQuery<StockBarsResponseType>({
    request: {
      url: baseUrl(`/v1/market-data/historical-bars/${symbol}`),
      method: 'GET',
      headers: { ...authHeader },
      query: query,
    },
  });
}
