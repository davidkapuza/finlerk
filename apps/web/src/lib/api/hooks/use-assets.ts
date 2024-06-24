import React from 'react';
import useSWRInfinite from 'swr/infinite';
import { MarketDataApi } from '../market-data.api';
import { useApi } from './use-api';
import { Asset, InfinityPaginationResponseDto } from '@finlerk/shared';

export const ASSETS_PAGE_SIZE = 30;

export function useAssets(globalFilter: string) {
  const { assetsFetcher } = useApi(MarketDataApi);

  const getKey = React.useCallback(
    (
      pageIndex: number,
      previousPageData: InfinityPaginationResponseDto<Asset>,
    ) => {
      if (previousPageData && !previousPageData.hasNextPage) return null; // reached the end
      return `/api/v1/market-data/assets?page=${
        pageIndex + 1
      }&limit=${ASSETS_PAGE_SIZE}&globalFilter=${globalFilter}`;
    },
    [globalFilter],
  );

  return useSWRInfinite(getKey, assetsFetcher, {
    parallel: true,
    initialSize: 1,
  });
}
