import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, Validate } from 'class-validator';
import { IsBeforeConstraint } from '../../constraints/is-before.contraint';

export class GetBarsDto {
  @ApiProperty({
    example: '1Min',
    description:
      'The timeframe of the bar aggregation. 5Min for example creates 5 minute aggregates.',
  })
  @IsString()
  timeframe: string;

  @ApiPropertyOptional({
    description:
      'The inclusive start of the interval. Format: RFC-3339 or YYYY-MM-DD If missing, the default value is the beginning of the current day.',
  })
  @Validate(IsBeforeConstraint, ['end'])
  @IsDateString()
  @IsOptional()
  start?: string;

  @ApiPropertyOptional({
    description:
      'The inclusive end of the interval. Format: RFC-3339 or YYYY-MM-DD. If missing, the default value is the current time.',
  })
  @IsDateString()
  @IsOptional()
  end?: string;
}
