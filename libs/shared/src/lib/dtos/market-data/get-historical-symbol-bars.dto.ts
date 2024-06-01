import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { GetBarsDto } from './get-bars.dto';

export class GetHistoricalSymbolBarsDto extends GetBarsDto {
  @ApiProperty({ example: 'TSLA', description: 'The symbol to query for.' })
  @IsString()
  symbol: string;
}
