import { StockBarsResponseType } from '@qbick/shared';
import { AxiosResponse } from 'axios';
import { AlpacaBarsResponseType } from '../types/alpaca-bars-response.type';

export const stockBarsResponseTransformer = (
  response: AxiosResponse<AlpacaBarsResponseType>,
): AxiosResponse<StockBarsResponseType> => {
  const { data, ...rest } = response;
  return {
    data: {
      bars: Object.fromEntries(
        Object.entries(data.bars).map(([symbol, bars]) => [
          symbol,
          bars.map((bar) => ({
            time: Date.parse(bar.t) / 1000,
            open: bar.o,
            high: bar.h,
            low: bar.l,
            close: bar.c,
            volume: bar.v,
          })),
        ]),
      ),
    },
    ...rest,
  };
};
