import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { AssetAttributesEnum, AssetExchangesEnum } from '../../enums';

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
