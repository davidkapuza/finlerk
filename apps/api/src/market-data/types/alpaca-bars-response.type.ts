export type AlpacaBarsResponseType = {
  bars: {
    [symbol: string]: {
      c: number;
      h: number;
      l: number;
      n: number;
      o: number;
      t: string;
      v: number;
      vw: number;
    }[];
  };
  next_page_token: string;
};
