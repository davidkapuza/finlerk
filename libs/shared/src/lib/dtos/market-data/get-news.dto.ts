import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsBeforeConstraint } from '../../constraints/is-before.contraint';

export class GetNewsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  symbols?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Validate(IsBeforeConstraint, ['end'])
  @IsDateString()
  start?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  end?: string;
}
