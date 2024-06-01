import { RelationalEntityHelper } from '@/lib/utils/relational-entity-helper';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'veirification-tokens',
})
export class VerificationTokenEntity extends RelationalEntityHelper {
  @Column('text', { primary: true })
  identifier: string;

  @Column('timestamptz')
  expires: Date;

  @Column('text', { primary: true })
  token: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
