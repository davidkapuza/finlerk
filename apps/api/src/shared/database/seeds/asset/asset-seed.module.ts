import { MarketDataModule } from '@/market-data/market-data.module';
import { AssetEntity } from '@/shared/entities/asset.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetSeedService } from './asset-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([AssetEntity]), MarketDataModule],
  providers: [AssetSeedService],
  exports: [AssetSeedService],
})
export class AssetSeedModule {}
