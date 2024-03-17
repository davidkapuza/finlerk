import { Status } from '@qbick/shared';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { RelationalEntityHelper } from '../utils/relational-entity-helper';

@Entity({
  name: 'status',
})
export class StatusEntity extends RelationalEntityHelper implements Status {
  @PrimaryColumn()
  id: number;

  @Column()
  name?: string;
}
