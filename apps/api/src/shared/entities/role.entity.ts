import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNumber } from 'class-validator';
import { EntityHelper } from '@shared/utils/entity-helper';

@Entity()
export class RoleEntity extends EntityHelper {
  @ApiProperty({ example: 1 })
  @PrimaryColumn()
  @IsNumber()
  id: number;

  @Allow()
  @ApiProperty({ example: 'Admin' })
  @Column()
  name?: string;
}
