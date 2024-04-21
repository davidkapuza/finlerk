import { AssetClassesEnum } from '../enums/asset-classes.enum';
import { AssetExchangesEnum } from '../enums/asset-exchanges.enum';

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
