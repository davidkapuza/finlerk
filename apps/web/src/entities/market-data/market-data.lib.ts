import {
  AlpacaSymbolBarsResponseType,
  StockBarsResponseType,
} from '@finlerk/shared';

const userTimezoneOffset = -new Date().getTimezoneOffset() * 60000;

export function mapHistoricalBars(
  data: AlpacaSymbolBarsResponseType,
): StockBarsResponseType {
  return {
    bars: data.bars.map((bar) => {
      return {
        time: Math.floor(
          (new Date(bar.t).getTime() + userTimezoneOffset) / 1000,
        ),
        open: bar.o,
        high: bar.h,
        low: bar.l,
        close: bar.c,
        volume: bar.v,
      };
    }),
  };
}
