'use client';

import {
  createChart,
  ColorType,
  DeepPartial,
  LayoutOptions,
} from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../../tailwind.config';
import { useTheme } from 'next-themes';

const { theme } = resolveConfig(tailwindConfig);

function getLayoutOptionsForTheme(
  isDarkTheme: boolean,
): DeepPartial<LayoutOptions> {
  return isDarkTheme
    ? {
        textColor: theme.colors.white,
        background: { type: ColorType.Solid, color: 'transparent' },
      }
    : {
        textColor: theme.colors.black,
        background: { type: ColorType.Solid, color: 'transparent' },
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

export const StockChart = (props) => {
  const { data } = props;
  const layout = useThemeAwareLayoutOptions();
  const chartContainerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    const chart = createChart(chartContainerRef.current, {
      layout,
      rightPriceScale: {
        borderVisible: false,
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
      width: chartContainerRef.current.clientWidth,
      height: 300,
    });
    chart.timeScale().fitContent();

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: theme.colors.green.DEFAULT,
      downColor: theme.colors.red.DEFAULT,
      borderVisible: false,
      wickUpColor: theme.colors.green.DEFAULT,
      wickDownColor: theme.colors.red.DEFAULT,
    });
    candlestickSeries.setData(data);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);

      chart.remove();
    };
  }, [data, layout]);

  return <div ref={chartContainerRef} />;
};
