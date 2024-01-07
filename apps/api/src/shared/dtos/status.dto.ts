import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Allow } from 'class-validator';

export class Status {
  @Allow()
  id: number;

  @Allow()
  name?: string;
}

export class StatusDto implements Status {
  @ApiProperty()
  @IsNumber()
  id: number;
}
