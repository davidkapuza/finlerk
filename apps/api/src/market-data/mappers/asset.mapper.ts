import { AssetEntity } from '@/shared/entities/asset.entity';
import { Asset } from '@qbick/shared';

export class AssetMapper {
  static toDomain(raw: AssetEntity): Asset {
    const asset = new Asset();
    asset.id = raw.id;
    asset.class = raw.class;
    asset.exchange = raw.exchange;
    asset.symbol = raw.symbol;
    asset.name = raw.name;
    asset.createdAt = raw.createdAt;
    asset.updatedAt = raw.updatedAt;
    asset.deletedAt = raw.deletedAt;
    return asset;
  }

  static toPersistence(asset: Asset): AssetEntity {
    const assetEntity = new AssetEntity();

    assetEntity.id = asset.id;
    assetEntity.class = asset.class;
    assetEntity.exchange = asset.exchange;
    assetEntity.symbol = asset.symbol;
    assetEntity.name = asset.name;
    assetEntity.createdAt = asset?.createdAt;
    assetEntity.updatedAt = asset?.updatedAt;
    assetEntity.deletedAt = asset?.deletedAt;
    return assetEntity;
  }
}
