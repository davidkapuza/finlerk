import { ApiResponseProperty } from '@nestjs/swagger';
import { AssetClassesEnum } from '../enums/market-data/asset-classes.enum';
import { AssetExchangesEnum } from '../enums/market-data/asset-exchanges.enum';

export class Asset {
  @ApiResponseProperty({
    type: String,
  })
  id: string;

  @ApiResponseProperty({
    type: String,
    example: AssetClassesEnum.us_equity,
  })
  class: AssetClassesEnum;

  @ApiResponseProperty({
    type: String,
    example: AssetExchangesEnum.NASDAQ,
  })
  exchange: AssetExchangesEnum;

  @ApiResponseProperty({
    type: String,
    example: 'AAPL',
  })
  symbol: string;

  @ApiResponseProperty({
    type: String,
    example: 'Apple Inc. Common Stock',
  })
  name: string;

  @ApiResponseProperty()
  createdAt?: Date;

  @ApiResponseProperty()
  updatedAt?: Date;

  @ApiResponseProperty()
  deletedAt?: Date;
}
