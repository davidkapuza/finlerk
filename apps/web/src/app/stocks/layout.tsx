import { Metadata } from 'next';
import { cookies } from 'next/headers';
import ResizableLayout from './components/resizable-layout';
import { StocksPreviewCarousel } from './components/stocks-preview-carousel';
import api from '@/lib/api';

export const metadata: Metadata = {
  title: 'Examples',
  description: 'Check out some examples app built using the components.',
};

interface StocksLayoutProps {
  children: React.ReactNode;
}

async function getHistoricalBars() {
  return await api
    .get('/api/v1/stocks/historical-bars?symbol=TSLA')
    .then((response) => response.data);
}

async function getLatestTrades() {
  return await api
    .get(
      '/api/v1/stocks/latest-trades?symbols=TSLA%2CAAPL%2CAMZN%2CGOOG%2CGOOGL%2CNVDA%2CGM%2CNFLX',
    )
    .then((response) => response.data);
}

export default async function StocksLayout({ children }: StocksLayoutProps) {
  const layout = cookies().get('react-resizable-panels:layout');

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  const [historicalBars, latestTrades] = await Promise.all([
    getHistoricalBars(),
    getLatestTrades(),
  ]);

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-3xl font-bold tracking-tight pt-7">Stocks</h2>
      <StocksPreviewCarousel latestTrades={latestTrades} />
      <ResizableLayout
        trades={historicalBars}
        defaultLayout={defaultLayout}
        navCollapsedSize={4}
      >
        {children}
      </ResizableLayout>
    </div>
  );
}
