export type MostActiveStocksResponseType = {
  last_updated: string;
  most_actives: {
    symbol: string;
    trade_count: number;
    volume: number;
  }[];
};
