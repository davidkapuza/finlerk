import { Role } from '@qbick/shared';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { RelationalEntityHelper } from '../utils/relational-entity-helper';

@Entity({
  name: 'role',
})
export class RoleEntity extends RelationalEntityHelper implements Role {
  @PrimaryColumn()
  id: number;

  @Column()
  name?: string;
}
