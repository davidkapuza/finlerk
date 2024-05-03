import { marketDataApi } from '../../api/market-data.api';
import { Separator } from '@finlerk/shadcn-ui';

async function getHistoricalBars(symbol: string) {
  console.log(symbol);
  return await marketDataApi.getHistoricalBars({
    symbols: symbol,
    timeframe: '1Min',
    start: '2024-03-02',
    end: '2024-03-14',
  });
}

interface StockDetailsPageProps {
  params: { symbol: string };
}

export default async function StockDetailsPage({
  params,
}: StockDetailsPageProps) {
  await getHistoricalBars(params.symbol);

  // TODO Stock details
  return (
    <div className="container m-auto m-h-screen">
      <div className="h-[52px]">{params.symbol}</div>
      <Separator />
    </div>
  );
}
