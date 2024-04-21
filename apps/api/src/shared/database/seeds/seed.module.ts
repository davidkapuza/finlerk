import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { RoleSeedModule } from './role/role-seed.module';
import { StatusSeedModule } from './status/status-seed.module';
import { UserSeedModule } from './user/user-seed.module';
import databaseConfig from '../config/database.config';
import appConfig from '@/shared/config/app.config';
import { TypeOrmConfigService } from '../typeorm-config.service';
import { AssetSeedModule } from './asset/asset-seed.module';
import { CacheModule } from '@nestjs/cache-manager';
import redisStore from 'cache-manager-redis-store';
import { ConfigType } from '@/shared/config/config.type';
import { RedisPubSubModule } from '@/redis-pub-sub/redis-pub-sub.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import alpacaConfig from '@/alpaca/config/alpaca.config';
import redisConfig from '@/redis-pub-sub/config/redis.config';
@Module({
  imports: [
    RoleSeedModule,
    StatusSeedModule,
    UserSeedModule,
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
