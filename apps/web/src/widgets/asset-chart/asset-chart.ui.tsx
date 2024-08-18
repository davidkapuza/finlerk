'use client';

import { marketDataQuery } from '@/entities/market-data';
import { cn } from '@/shared/utils';
import { Separator } from '@finlerk/shadcn-ui';
import { StockBarsResponseType } from '@finlerk/shared';
import { formatISO, isBefore, subDays, subMonths, subYears } from 'date-fns';
import {
  createChart,
  type DeepPartial,
  type LayoutOptions,
  type Range,
} from 'lightweight-charts';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { io } from 'socket.io-client';

interface AssetChartProps {
  symbol: string;
  historicalBars: StockBarsResponseType;
}

function getVisibleLogicalRange(
  dataLength: number,
  addedPoints: number,
): Range<number> {
  return { from: addedPoints + 0.5, to: dataLength + addedPoints };
}

function getLayoutOptionsForTheme(
  isDarkTheme: boolean,
): DeepPartial<LayoutOptions> {
  return isDarkTheme
    ? {
        textColor: '#fff',
        background: { color: 'transparent' },
      }
    : {
        textColor: '#000000',
        background: { color: 'transparent' },
      };
}

function useThemeAwareLayoutOptions(): DeepPartial<LayoutOptions> {
  const { theme: colorMode } = useTheme();
  const isDarkTheme = colorMode === 'dark';

  const [layoutOptions, setLayoutOptions] = React.useState<
    DeepPartial<LayoutOptions>
  >(getLayoutOptionsForTheme(isDarkTheme));

  React.useEffect(() => {
    setLayoutOptions(getLayoutOptionsForTheme(isDarkTheme));
  }, [isDarkTheme]);

  return layoutOptions;
}

let date = new Date();
date.setHours(9, 30, 0, 0);

if (isBefore(new Date(), date)) date = subDays(date, 1);

const timeRanges = [
  {
    label: '1 day',
    timeframe: '1Min',
    get date() {
      return date;
    },
  },
  {
    label: '5 days',
    timeframe: '15Min',
    get date() {
      return subDays(date, 5);
    },
  },
  {
    label: '1 month',
    timeframe: '30Min',
    get date() {
      return subMonths(date, 1);
    },
  },
  {
    label: '6 months',
    timeframe: '2H',
    get date() {
      return subMonths(date, 6);
    },
  },
  {
    label: '1 year',
    timeframe: '1D',
    get date() {
      return subYears(date, 1);
    },
  },
  {
    label: '5 years',
    timeframe: '1W',
    get date() {
      return subYears(date, 5);
    },
  },
];

let start = new Date();
start.setHours(9, 30, 0, 0);

if (isBefore(new Date(), start)) start = subDays(start, 1);

export function AssetChart({ symbol, historicalBars }: AssetChartProps) {
  const [selectedTimeRange, setSelectedTimeRange] = React.useState(
    timeRanges[0],
  );

  const { data } = marketDataQuery.useHistoricalBarsQuery(
    {
      symbol,
      timeframe: selectedTimeRange.timeframe,
      start: formatISO(selectedTimeRange.date),
    },
    {
      fallbackData: historicalBars,
    },
  );

  const chartContainerRef = React.useRef<HTMLDivElement>(null);
  const chart = React.useRef(null);
  const candleSeries = React.useRef(null);

  const layout = useThemeAwareLayoutOptions();

  React.useEffect(() => {
    chart.current = createChart(chartContainerRef.current, {
      layout,
      rightPriceScale: {
        borderVisible: false,
        autoScale: false,
      },
      grid: {
        horzLines: {
          visible: false,
        },
        vertLines: {
          visible: false,
        },
      },
      timeScale: {
        timeVisible: true,
        borderVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      handleScroll: false,
      handleScale: false,
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    candleSeries.current = chart.current.addCandlestickSeries({
      upColor: '#089981',
      downColor: '#f23645',
      borderVisible: false,
      wickUpColor: '#089981',
      wickDownColor: '#f23645',
    });

    if (data?.bars && data.bars.length > 0) {
      candleSeries.current.setData(data.bars);
      const visibleLogicalRange = getVisibleLogicalRange(data.bars.length, 0);
      chart.current.timeScale().setVisibleLogicalRange(visibleLogicalRange);
    }

    return () => {
      chart.current.remove();
    };
  }, [data, layout]);

  React.useEffect(() => {
    const resizeListener = () => {
      if (!chartContainerRef.current || !chart.current) return;

      const { width, height } =
        chartContainerRef.current.getBoundingClientRect();
      chart.current.resize(width, height);
      const panelWidth = window.innerWidth;

      const showTimeScale = width > 495;
      const showPriceScale = panelWidth > 299;
      chart.current.applyOptions({
        timeScale: {
          visible: showTimeScale,
        },
        rightPriceScale: {
          visible: showPriceScale,
        },
      });

      chart.current.applyOptions({
        timeScale: {
          lockVisibleTimeRangeOnResize: true,
        },
      });
    };

    const observer = new ResizeObserver(resizeListener);

    observer.observe(chartContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  React.useEffect(() => {
    chart.current.applyOptions({ layout });
  }, [layout]);

  const [bar, setBar] = React.useState(null);

  React.useEffect(() => {
    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
      socket.emit('subscribe', { asset: symbol });
    });
    socket.on('new-bar', (data) => {
      setBar(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [symbol]);

  React.useEffect(() => {
    if (bar) {
      candleSeries.current.update({
        time: Date.parse(bar.t) / 1000,
        open: bar.o,
        high: bar.h,
        low: bar.l,
        close: bar.c,
      });
    }
  }, [bar]);

  const lastPrice = bar?.c ?? data.bars.at(-1).close;
  const diff = (data.bars[0].close - lastPrice).toFixed(2);

  return (
    <>
      <div className="py-8">
        <p className="text-xl">{symbol}</p>
        <div>
          <span className="text-4xl font-semibold">{lastPrice}</span>{' '}
          <span className="text-sm text-muted-foreground">USD</span> {diff}
        </div>
      </div>
      <Separator />
      <div ref={chartContainerRef} className="h-[500px]" />
      <div className="flex flex-row w-full gap-3 mt-4">
        {timeRanges.map((range) => (
          <button
            key={range.label}
            onClick={() => setSelectedTimeRange(range)}
            className={cn(
              'flex-1  rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
              selectedTimeRange.label === range.label && 'bg-muted',
            )}
          >
            {range.label}
          </button>
        ))}
      </div>
    </>
  );
}
