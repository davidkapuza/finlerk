export type AlpacaBarResponseType = {
  c: number;
  h: number;
  l: number;
  n: number;
  o: number;
  t: string;
  v: number;
  vw: number;
};

export type AlpacaBarsResponseType = {
  bars: {
    [symbol: string]: AlpacaBarResponseType[];
  };
  next_page_token: string;
};
