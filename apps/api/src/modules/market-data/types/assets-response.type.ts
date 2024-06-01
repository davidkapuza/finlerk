import {
  AssetClassesEnum,
  AssetExchangesEnum,
  AssetStatusEnum,
} from '@finlerk/shared';

export type AssetResponseType = {
  id: string;
  class: AssetClassesEnum;
  exchange: AssetExchangesEnum;
  symbol: string;
  name: string;
  status: AssetStatusEnum;
  tradable: boolean;
  marginable: boolean;
  maintenance_margin_requirement?: number;
  shortable: boolean;
  easy_to_borrow: boolean;
  fractionable: boolean;
  attributes?: string[];
  min_order_size?: string;
  min_trade_increment?: string;
};

export type AssetsResponseType = AssetResponseType[];
