import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNumber } from 'class-validator';

export class Role {
  @IsNumber()
  id: number;

  @Allow()
  name?: string;
}

export class RoleDto implements Role {
  @ApiProperty()
  @IsNumber()
  id: number;
}
