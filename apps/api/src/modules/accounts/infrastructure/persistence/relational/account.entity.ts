import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RelationalEntityHelper } from '@/lib/utils/relational-entity-helper';
import { UserEntity } from '@/modules/users/infrastructure/persistence/relational/user.entity';

@Entity({
  name: 'accounts',
})
export class AccountEntity extends RelationalEntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  @Index()
  user: UserEntity;

  @Column('varchar')
  type: string;

  @Column('varchar')
  provider: string;

  @Column('varchar')
  providerAccountId: string;

  @Column('text', { nullable: true })
  refresh_token: string | null;

  @Column('text', { nullable: true })
  access_token: string | null;

  @Column({ type: 'bigint', nullable: true })
  expires_at: string | null;

  @Column('text', { nullable: true })
  id_token: string | null;

  @Column('text', { nullable: true })
  scope: string | null;

  @Column('text', { nullable: true })
  session_state: string | null;

  @Column('text', { nullable: true })
  token_type: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
