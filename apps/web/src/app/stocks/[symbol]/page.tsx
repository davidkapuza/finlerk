import { AlpacaBar } from '@alpacahq/alpaca-trade-api/dist/resources/datav2/entityv2';
import { StockChart } from '../components/stock-chart';
import api from '../../../lib/api';
import { Separator } from '@qbick/shadcn-ui';

async function getHistoricalBars(symbol: string) {
  return await api
    .get<AlpacaBar[]>('/api/v1/stocks/historical-bars', {
      params: {
        symbol,
      },
    })
    .then((response) => response.data);
}

interface StockDetailsPageProps {
  params: { symbol: string };
}

export default async function StockDetailsPage({
  params,
}: StockDetailsPageProps) {
  const historicalBars = await getHistoricalBars(params.symbol);
  // TODO Move into client component
  // const [percentageChange, setPercentageChange] = React.useState(null);
  // const [trade, setTrade] = React.useState(null);

  // React.useEffect(() => {
  //   const socket = io('http://localhost:3000');

  //   socket.on('connect', () => {
  //     socket.emit('fetch-stock-trades', ['TSLA']);
  //   });
  //   socket.on('stock-trades-stream', (data) => {
  //     setTrade(data.trade);
  //     setPercentageChange(
  //       (((data.trade.Price - trade?.Price) / trade?.Price) * 100).toFixed(2),
  //     );
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  return (
    <>
      <div className="h-[52px]">{params.symbol}</div>
      <Separator />
      <div className="p-10">
        {/* <div>
          <span className="text-sm font-medium text-muted-foreground">
            {trade?.Symbol}
          </span>
          <h1 className="text-2xl font-bold">${trade?.Price}</h1>
          <p
            className={cn(
              `text-xs font-bold ${
                percentageChange < 0 ? 'text-red' : 'text-green'
              }`,
            )}
          >
            {percentageChange}%
          </p>
        </div> */}
        <StockChart chartData={historicalBars} symbol={params.symbol} />
      </div>
    </>
  );
}
