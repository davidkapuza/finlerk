import { Asset } from '@/market-data/domains/asset';
import { AssetClassesEnum } from '@/market-data/enums/asset-classes.enum';
import { AssetExchangesEnum } from '@/market-data/enums/asset-exchanges.enum';
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
