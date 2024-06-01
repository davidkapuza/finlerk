import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import databaseConfig from '../config/database.config';
import appConfig from '@/lib/config/app.config';
import { TypeOrmConfigService } from '../typeorm-config.service';
import { AssetSeedModule } from './asset/asset-seed.module';
import { CacheModule } from '@nestjs/cache-manager';
import redisStore from 'cache-manager-redis-store';
import { ConfigType } from '@/lib/config/config.type';
import { RedisPubSubModule } from '@/modules/redis-pub-sub/redis-pub-sub.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import alpacaConfig from '@/modules/alpaca/config/alpaca.config';
import redisConfig from '@/modules/redis-pub-sub/config/redis.config';
@Module({
  imports: [
    AssetSeedModule,
    EventEmitterModule.forRoot({
      global: true,
    }),
    RedisPubSubModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigType>) => ({
        host: configService.get('redis.host', {
          infer: true,
        }),
        port: configService.get('redis.port', {
          infer: true,
        }),
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigType>) => ({
        host: configService.get('redis.host', {
          infer: true,
        }),
        port: configService.get('redis.port', {
          infer: true,
        }),
        store: redisStore,
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig, alpacaConfig, redisConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class SeedModule {}
