import { ApiResponseProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class Status {
  @Allow()
  @ApiResponseProperty({
    type: Number,
  })
  id: number;

  @Allow()
  @ApiResponseProperty({
    type: String,
    example: 'active',
  })
  name?: string;
}
