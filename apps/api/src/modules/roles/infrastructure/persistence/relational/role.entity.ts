import { RelationalEntityHelper } from '@/lib/utils/relational-entity-helper';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'roles',
})
export class RoleEntity extends RelationalEntityHelper {
  @ApiResponseProperty({
    type: Number,
  })
  @PrimaryColumn()
  id: number;

  @ApiResponseProperty({
    type: String,
    example: 'admin',
  })
  @Column()
  name?: string;
}
