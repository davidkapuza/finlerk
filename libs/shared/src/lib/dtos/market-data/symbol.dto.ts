import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SymbolDto {
  @ApiProperty({ example: 'TSLA', description: 'The symbol to query for.' })
  @IsString()
  symbol: string;
}
