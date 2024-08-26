import {
  Asset,
  GetHistoricalSymbolBarsDto,
  InfinityPaginationResponseDto,
  SymbolDto,
} from '@finlerk/shared';
import React from 'react';
import useSWRInfinite from 'swr/infinite';
import {
  historicalBarsQuery,
  infiniteAssetsQuery,
  mostActiveStocksSnapshotsQuery,
  stockSnapshotQuery,
} from './market-data.api';
import useSWR, { SWRConfiguration } from 'swr';

export const ASSETS_PAGE_SIZE = 30;

const keys = {
  infiniteAssetsQuery: (
    pageIndex: number,
    pageSize: number,
    globalFilter: string,
  ) => ({
    url: '/api/v1/market-data/assets',
    pageIndex,
    pageSize,
    globalFilter,
  }),
  historicalBarsQuery: (query: GetHistoricalSymbolBarsDto) => ({
    url: `/api/v1/market-data/historical-bars`,
    ...query,
  }),
  mostActiveStocksSnapshotsQuery: () => 'most-active-stocks-snapshot',
  stockSnapshotQuery: (params: SymbolDto) => ({
    url: 'stock-snapshot',
    symbol: params.symbol,
  }),
};

export function useInfiniteAssetsQuery(globalFilter: string) {
  const getKey = React.useCallback(
    (
      pageIndex: number,
      previousPageData: InfinityPaginationResponseDto<Asset>,
    ) => {
      if (previousPageData && !previousPageData.hasNextPage) return null; // reached the end
      return keys.infiniteAssetsQuery(
        pageIndex,
        ASSETS_PAGE_SIZE,
        globalFilter,
      );
    },
    [globalFilter],
  );

  return useSWRInfinite(getKey, (params) => infiniteAssetsQuery(params), {
    parallel: true,
    initialSize: 1,
  });
}

export function useHistoricalBarsQuery(
  query: GetHistoricalSymbolBarsDto,
  config?: SWRConfiguration,
) {
  return useSWR(
    keys.historicalBarsQuery(query),
    () => historicalBarsQuery({ query }),
    config,
  );
}

export function useMostActiveStocksSnapshotsQuery(config?: SWRConfiguration) {
  return useSWR(
    keys.mostActiveStocksSnapshotsQuery(),
    () => mostActiveStocksSnapshotsQuery(),
    config,
  );
}

export function useStockSnapshotQuery(
  query: SymbolDto,
  config?: SWRConfiguration,
) {
  return useSWR(
    keys.stockSnapshotQuery(query),
    () => stockSnapshotQuery(query),
    config,
  );
}
