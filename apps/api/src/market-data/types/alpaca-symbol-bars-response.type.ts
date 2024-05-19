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
