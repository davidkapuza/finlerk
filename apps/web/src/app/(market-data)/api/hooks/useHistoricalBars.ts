import { GetHistoricalSymbolBarsDto } from '@finlerk/shared';
import useSWR, { SWRConfiguration } from 'swr';
import { marketDataApi } from '../market-data.api';

export function useHistoricalBars(
  { symbol, ...params }: GetHistoricalSymbolBarsDto,
  config?: SWRConfiguration,
) {
  return useSWR(
    { url: `/api/v1/market-data/historical-bars/${symbol}`, ...params },
    marketDataApi.getHistoricalBars,
    config,
  );
}
