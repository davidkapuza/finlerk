import { Column, Entity, PrimaryColumn } from 'typeorm';
import { RelationalEntityHelper } from '@/lib/utils/relational-entity-helper';
import { ApiResponseProperty } from '@nestjs/swagger';

@Entity({
  name: 'statuses',
})
export class StatusEntity extends RelationalEntityHelper {
  @ApiResponseProperty({
    type: Number,
  })
  @PrimaryColumn()
  id: number;

  @ApiResponseProperty({
    type: String,
    example: 'active',
  })
  @Column()
  name?: string;
}
