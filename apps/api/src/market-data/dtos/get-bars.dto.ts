import { IsBeforeConstraint } from '@/shared/validators/constraints/is-before.contraint';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, Validate } from 'class-validator';

export class GetBarsDto {
  @ApiProperty({ example: 'TSLA' })
  @IsNotEmpty()
  symbols: string;

  @ApiProperty({ example: '1Min' })
  @IsNotEmpty()
  timeframe: string;

  @ApiProperty({ example: '2024-03-02' })
  @Validate(IsBeforeConstraint, ['end'])
  @IsDateString()
  start: string;

  @ApiProperty({ example: '2024-03-14' })
  @IsDateString()
  end: string;
}
