import { StockBarsResponseType } from '@finlerk/shared';
import { AxiosResponse } from 'axios';
import { AlpacaSymbolBarsResponseType } from '../types/alpaca-symbol-bars-response.type';

export const stockBarsResponseTransformer = (
  response: AxiosResponse<AlpacaSymbolBarsResponseType>,
): AxiosResponse<StockBarsResponseType> => {
  const { data, ...rest } = response;
  return {
    data: {
      bars: data.bars?.map((bar) => ({
        time: Date.parse(bar.t) / 1000,
        open: bar.o,
        high: bar.h,
        low: bar.l,
        close: bar.c,
        volume: bar.v,
      })),
    },
    ...rest,
  };
};
