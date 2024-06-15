import { ApiResponseProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class Role {
  @Allow()
  @ApiResponseProperty({
    type: Number,
  })
  id: number;

  @Allow()
  @ApiResponseProperty({
    type: String,
    example: 'admin',
  })
  name?: string;
}
