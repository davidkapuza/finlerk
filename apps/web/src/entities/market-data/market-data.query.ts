import {
  Asset,
  GetHistoricalSymbolBarsDto,
  InfinityPaginationResponseDto,
} from '@finlerk/shared';
import React from 'react';
import useSWRInfinite from 'swr/infinite';
import { historicalBarsQuery, infiniteAssetsQuery } from './market-data.api';
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
