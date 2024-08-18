export type StockBar = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type StockBarsResponseType = {
  bars: StockBar[];
};

export type AlpacaSymbolBarResponseType = {
  c: number;
  h: number;
  l: number;
  n: number;
  o: number;
  t: string;
  v: number;
  vw: number;
};

export type AlpacaSymbolBarsResponseType = {
  bars: AlpacaSymbolBarResponseType[];
  symbol: string;
  next_page_token: string;
};
