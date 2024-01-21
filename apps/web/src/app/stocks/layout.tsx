import { Metadata } from 'next';
import { cookies } from 'next/headers';
import ResizableLayout from './components/resizable-layout';
import { StocksPreviewCarousel } from './components/stocks-preview-carousel';

export const metadata: Metadata = {
  title: 'Examples',
  description: 'Check out some examples app built using the components.',
};

interface StocksLayoutProps {
  children: React.ReactNode;
}

const initialData = [
  { time: '2018-12-22', open: 75.16, high: 82.84, low: 36.16, close: 45.72 },
  { time: '2018-12-23', open: 45.12, high: 53.9, low: 45.12, close: 48.09 },
  { time: '2018-12-24', open: 60.71, high: 60.71, low: 53.39, close: 59.29 },
  { time: '2018-12-25', open: 68.26, high: 68.26, low: 59.04, close: 60.5 },
  { time: '2018-12-26', open: 67.71, high: 105.85, low: 66.67, close: 91.04 },
  { time: '2018-12-27', open: 91.04, high: 121.4, low: 82.7, close: 111.4 },
  {
    time: '2018-12-28',
    open: 111.51,
    high: 142.83,
    low: 103.34,
    close: 131.25,
  },
  { time: '2018-12-29', open: 131.33, high: 151.17, low: 77.68, close: 96.43 },
  { time: '2018-12-30', open: 106.33, high: 110.2, low: 90.39, close: 98.1 },
  { time: '2018-12-31', open: 109.87, high: 114.69, low: 85.66, close: 111.26 },
];

export default function StocksLayout({ children }: StocksLayoutProps) {
  const layout = cookies().get('react-resizable-panels:layout');

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-3xl font-bold tracking-tight pt-7">Stocks</h2>
      <StocksPreviewCarousel />
      <ResizableLayout
        trades={initialData}
        defaultLayout={defaultLayout}
        navCollapsedSize={4}
      >
        {children}
      </ResizableLayout>
    </div>
  );
}
