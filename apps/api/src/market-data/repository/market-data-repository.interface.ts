import { AssetEntity } from '@/shared/entities/asset.entity';
import { BaseInterfaceRepository } from '@/shared/repositories/base/base.interface.repository';
import { IPaginationOptions } from '@qbick/shared';

export interface MarketDataRepositoryInterface
  extends BaseInterfaceRepository<AssetEntity> {
  findManyWithPagination({
    paginationOptions,
    globalFilter,
  }: {
    paginationOptions: IPaginationOptions;
    globalFilter?: string;
  }): Promise<AssetEntity[]>;
}
