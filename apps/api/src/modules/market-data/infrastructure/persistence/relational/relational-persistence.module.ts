import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetRepository } from '../asset.repository';
import { AssetEntity } from './entities/asset.entity';
import { AssetRelationalRepository } from './repositories/asset.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AssetEntity])],
  providers: [
    {
      provide: AssetRepository,
      useClass: AssetRelationalRepository,
    },
  ],
  exports: [AssetRepository],
})
export class RelationalMarketDataPersistenceModule {}
