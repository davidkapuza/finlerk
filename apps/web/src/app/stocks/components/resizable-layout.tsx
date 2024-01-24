'use client';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Newspaper } from 'lucide-react';
import * as React from 'react';
import { Nav } from './nav';
import { StockChart } from './stock-chart';
import { io } from 'socket.io-client';

interface ResizableLayoutProps {
  trades: unknown;
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
  children: React.ReactNode;
}

export default function ResizableLayout({
  trades,
  defaultLayout = [640, 440, 265],
  defaultCollapsed = false,
  navCollapsedSize,
  children,
}: ResizableLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [percentageChange, setPercentageChange] = React.useState(null);
  const [trade, setTrade] = React.useState(null);

  React.useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      socket.emit('fetch-stock-trades', ['TSLA']);
    });
    socket.on('stock-trades-stream', (data) => {
      setTrade(data.trade);
      setPercentageChange(
        (((data.trade.Price - trade?.Price) / trade?.Price) * 100).toFixed(2),
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="rounded-[0.5rem] border bg-background shadow-md md:shadow-xl">
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes,
          )}`;
        }}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel defaultSize={defaultLayout[0]} minSize={30}>
          <div className="h-[52px]"></div>
          <Separator />
          <div className="p-10">
            <div>
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
            </div>
            <StockChart chartData={trades} />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <div className="h-[52px]"></div>
          <Separator />
          {children}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={defaultLayout[2]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={15}
          maxSize={20}
          onCollapse={(collapsed) => {
            setIsCollapsed(collapsed);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              collapsed,
            )}`;
          }}
          className={cn(
            isCollapsed &&
              'min-w-[50px] transition-all duration-300 ease-in-out',
          )}
        >
          <div className="h-[52px]"></div>
          <Separator />
          <Nav
            isCollapsed={isCollapsed}
            links={[
              {
                title: 'News',
                label: '128',
                icon: Newspaper,
                variant: 'default',
                href: '/stocks',
              },
            ]}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
