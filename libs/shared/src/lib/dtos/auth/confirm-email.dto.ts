import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ConfirmEmailType } from '../../types';

export class ConfirmEmailDto implements ConfirmEmailType {
  @ApiProperty()
  @IsNotEmpty()
  hash: string;
}
