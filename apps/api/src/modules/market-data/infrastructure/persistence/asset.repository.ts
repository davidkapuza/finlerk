import { Asset, IPaginationOptions } from '@finlerk/shared';

export abstract class AssetRepository {
  abstract findManyWithPagination({
    globalFilter,
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
    globalFilter: string;
  }): Promise<Asset[]>;
}
