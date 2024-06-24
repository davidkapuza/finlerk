import { GetHistoricalSymbolBarsDto } from '@finlerk/shared';
import { formatISO, isBefore, subDays } from 'date-fns';
import { AssetChart } from '../../../../lib/ui/asset-chart';
import { marketDataApi } from '@/lib/api/market-data.api';
interface StockDetailsPageProps {
  params: { symbol: string };
}

async function getHistoricalBars({
  symbol,
  ...params
}: GetHistoricalSymbolBarsDto) {
  return await marketDataApi.getHistoricalBars({
    url: `/api/v1/market-data/historical-bars/${symbol}`,
    ...params,
  });
}

let start = new Date();
start.setHours(9, 30, 0, 0);

if (isBefore(new Date(), start)) start = subDays(start, 1);

export default async function StockDetailsPage({
  params,
}: StockDetailsPageProps) {
  const historicalBars = await getHistoricalBars({
    symbol: params.symbol,
    timeframe: '1Min',
    start: formatISO(start),
  });

  return <AssetChart symbol={params.symbol} historicalBars={historicalBars} />;
}
