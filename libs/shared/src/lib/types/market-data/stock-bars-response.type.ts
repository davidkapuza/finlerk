import { StockBar } from './stock-bar.type';

export type StockBarsResponseType = {
  bars: { [symbol: string]: StockBar[] };
};
