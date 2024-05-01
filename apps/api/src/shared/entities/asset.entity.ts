import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RelationalEntityHelper } from '../utils/relational-entity-helper';
import { Asset, AssetClassesEnum, AssetExchangesEnum } from '@qbick/shared';

@Entity({
  name: 'asset',
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
