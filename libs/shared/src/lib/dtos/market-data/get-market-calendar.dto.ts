import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, Validate } from 'class-validator';
import { IsBeforeConstraint } from '../../constraints/is-before.contraint';

export class GetMarketCalendarDto {
  @ApiPropertyOptional({
    description:
      'The first date to retrieve data for. (Inclusive) in YYYY-MM-DD format',
  })
  @Validate(IsBeforeConstraint, ['end'])
  @IsDateString()
  @IsOptional()
  start?: string;

  @ApiPropertyOptional({
    description:
      'The last date to retrieve data for. (Inclusive) in YYYY-MM-DD format',
  })
  @IsDateString()
  @IsOptional()
  end?: string;
}
