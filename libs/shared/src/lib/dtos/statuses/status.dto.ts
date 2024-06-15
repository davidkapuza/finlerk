import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Status } from '../../domains';

export class StatusDto implements Status {
  @ApiProperty()
  @IsNumber()
  id: number;
}
