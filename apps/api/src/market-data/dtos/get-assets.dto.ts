import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AssetExchangesEnum } from '../enums/asset-exchanges.enum';
import { AssetAttributesEnum } from '../enums/asset-attributes.enum';
import { Transform } from 'class-transformer';

export class GetAssetsDto {
  @ApiPropertyOptional({
    description: 'e.g. “active”. By default, all statuses are included.',
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Defaults to us_equity.',
  })
  @IsOptional()
  @IsString()
  asset_class?: string;

  @ApiPropertyOptional({
    enum: AssetExchangesEnum,
  })
  @IsOptional()
  @IsEnum(AssetExchangesEnum)
  exchange?: AssetExchangesEnum;

  @ApiPropertyOptional({
    enum: AssetAttributesEnum,
    isArray: true,
    description:
      'Comma separated values to query for more than one attribute. Assets which have any of the given attributes will be included.',
  })
  @IsOptional()
  @IsEnum(AssetAttributesEnum, { each: true })
  @Transform(({ value }) => {
    if (typeof value == 'string') {
      return value.split(',');
    }
    return value;
  })
  attributes?: AssetAttributesEnum[];
}
