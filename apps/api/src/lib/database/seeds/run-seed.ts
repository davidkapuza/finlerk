import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module';
import { AssetSeedService } from './asset/asset-seed.service';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  await app.get(AssetSeedService).run();

  await app.close();
};

void runSeed();
