import { AssetEntity } from '@/shared/entities/asset.entity';
import { BaseInterfaceRepository } from '@/shared/repositories/base/base.interface.repository';
import { IPaginationOptions } from '@qbick/shared';

export interface MarketDataRepositoryInterface
  extends BaseInterfaceRepository<AssetEntity> {
  findManyWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<AssetEntity[]>;
}
