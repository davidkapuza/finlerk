import { GetHistoricalSymbolBarsDto } from '@finlerk/shared';
import useSWR, { SWRConfiguration } from 'swr';
import { useApi } from './useApi';
import { MarketDataApi } from '../market-data.api';

export function useHistoricalBars(
  { symbol, ...params }: GetHistoricalSymbolBarsDto,
  config?: SWRConfiguration,
) {
  const { getHistoricalBars } = useApi(MarketDataApi);
  return useSWR(
    { url: `/api/v1/market-data/historical-bars/${symbol}`, ...params },
    getHistoricalBars,
    config,
  );
}
