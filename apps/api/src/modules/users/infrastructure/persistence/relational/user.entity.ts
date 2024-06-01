import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RelationalEntityHelper } from '@/lib/utils/relational-entity-helper';

@Entity({
  name: 'users',
})
export class UserEntity extends RelationalEntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { nullable: true })
  name: string | null;

  @Column('varchar', { nullable: true })
  email: string | null;

  @Column('timestamptz', { nullable: true })
  emailVerified: Date | null;

  @Column('text', { nullable: true })
  image: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
