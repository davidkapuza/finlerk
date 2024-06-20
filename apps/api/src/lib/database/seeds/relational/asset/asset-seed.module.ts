import { MarketDataModule } from '@/modules/market-data/market-data.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetSeedService } from './asset-seed.service';
import { AssetEntity } from '@/modules/market-data/infrastructure/persistence/relational/entities/asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AssetEntity]), MarketDataModule],
  providers: [AssetSeedService],
  exports: [AssetSeedService],
})
export class AssetSeedModule {}
