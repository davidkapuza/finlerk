import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Asset, AssetClassesEnum, AssetExchangesEnum } from '@finlerk/shared';
import { RelationalEntityHelper } from '@/lib/utils/relational-entity-helper';

@Entity({
  name: 'assets',
})
export class AssetEntity extends RelationalEntityHelper implements Asset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Index()
  @Column()
  class: AssetClassesEnum;

  @Index()
  @Column()
  exchange: AssetExchangesEnum;

  @Index()
  @Column()
  symbol: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
