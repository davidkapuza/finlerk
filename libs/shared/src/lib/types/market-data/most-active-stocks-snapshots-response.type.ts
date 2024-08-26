export type MostActiveStocksSnapshotsResponseType = {
  [symbol: string]: {
    dailyBar: Bar;
    latestQuote: Quote;
    latestTrade: Trade;
    minuteBar: Bar;
    prevDailyBar: Bar;
  };
};

type Bar = {
  c: number;
  h: number;
  l: number;
  n: number;
  o: number;
  t: string;
  v: number;
  vw: number;
};

type Quote = {
  ap: number;
  as: number;
  ax: string;
  bp: number;
  bs: number;
  bx: string;
  c: string[];
  t: string;
  z: string;
};

type Trade = {
  c: string[];
  i: number;
  p: number;
  s: number;
  t: string;
  x: string;
  z: string;
};
