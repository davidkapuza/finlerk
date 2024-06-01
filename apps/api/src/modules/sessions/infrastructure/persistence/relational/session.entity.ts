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
  name: 'sessions',
})
export class SessionEntity extends RelationalEntityHelper {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, {
    eager: true,
  })
  @Index()
  user: UserEntity;

  @Column('timestamptz')
  expires: Date;

  @Column('varchar')
  sessionToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
