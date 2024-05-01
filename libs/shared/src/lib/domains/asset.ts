import { AssetClassesEnum } from '../enums/market-data/asset-classes.enum';
import { AssetExchangesEnum } from '../enums/market-data/asset-exchanges.enum';

export class Asset {
  id: string;
  class: AssetClassesEnum;
  exchange: AssetExchangesEnum;
  symbol: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
