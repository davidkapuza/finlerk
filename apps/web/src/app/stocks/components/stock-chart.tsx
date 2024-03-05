'use client';

import * as React from 'react';
import {
  createChart,
  ISeriesApi,
  type DeepPartial,
  type IChartApi,
  type LayoutOptions,
  type Range,
} from 'lightweight-charts';
import { useTheme } from 'next-themes';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../../tailwind.config';
import { io } from 'socket.io-client';

const { theme } = resolveConfig(tailwindConfig);

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
        textColor: theme.colors.white,
        background: { color: 'transparent' },
      }
    : {
        textColor: theme.colors.black,
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

export const StockChart = ({ chartData, symbol }) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [bar, setBar] = React.useState(null);
  const [chart, setChart] = React.useState<IChartApi | null>(null);
  const [candlestickSeries, setCandlestickSeries] =
    React.useState<ISeriesApi<'Candlestick'> | null>(null);
  const layout = useThemeAwareLayoutOptions();

  React.useEffect(() => {
    const container = ref.current;

    if (!container) {
      return;
    }

    const c = createChart(container, {
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
        borderVisible: false,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      handleScroll: false,
      handleScale: false,
      height: 300,
    });

    const cS = c.addCandlestickSeries({
      upColor: theme.colors.green.DEFAULT,
      downColor: theme.colors.red.DEFAULT,
      borderVisible: false,
      wickUpColor: theme.colors.green.DEFAULT,
      wickDownColor: theme.colors.red.DEFAULT,
    });
    if (!chartData.length) return;

    cS.setData(chartData);

    const visibleLogicalRange = getVisibleLogicalRange(chartData.length, 0);
    c.timeScale().setVisibleLogicalRange(visibleLogicalRange);

    setChart(c);
    setCandlestickSeries(cS);

    container.setAttribute('reveal', 'true');

    return () => {
      c.remove();
      setChart(null);
    };
  }, []);

  React.useEffect(() => {
    if (!chart || !ref.current) {
      return;
    }

    const container = ref.current;

    const resizeListener = () => {
      const { width, height } = container.getBoundingClientRect();
      chart.resize(width, height);
      const panelWidth = window.innerWidth;

      const showTimeScale = width > 495;
      const showPriceScale = panelWidth > 299;
      chart.applyOptions({
        timeScale: {
          visible: showTimeScale,
        },
        rightPriceScale: {
          visible: showPriceScale,
        },
      });

      const smallerFont = panelWidth < 1024;
      const smallestFont = panelWidth < 568;
      chart.applyOptions({
        layout: {
          fontSize: smallestFont ? 6 : smallerFont ? 8 : 12,
        },
        timeScale: {
          lockVisibleTimeRangeOnResize: true,
        },
      });
    };

    const observer = new ResizeObserver(resizeListener);

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [chart]);

  React.useEffect(() => {
    if (!chart) {
      return;
    }

    chart.applyOptions({ layout });
  }, [layout, chart]);

  React.useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL);

    socket.on('connect', () => {
      socket.emit('stock-bars', [symbol]);
    });
    socket.on('events:new-bar', (data) => {
      setBar(data.bar);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  React.useEffect(() => {
    if (!candlestickSeries || !chart) {
      return;
    }
    if (bar) {
      candlestickSeries.update(bar);
      chart
        .timeScale()
        .setVisibleLogicalRange(getVisibleLogicalRange(chartData.length, 1));
    }
  }, [candlestickSeries, bar, chart, chartData.length]);

  return <div ref={ref} />;
};
