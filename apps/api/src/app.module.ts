import appConfig from '@/lib/config/app.config';
import databaseConfig from '@/lib/database/config/database.config';
import {
  AuthGoogleModule,
  AuthModule,
  MailModule,
  MailerModule,
  MarketDataModule,
  UsersModule,
} from '@/modules';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import redisStore from 'cache-manager-redis-store';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigType } from './lib/config/config.type';
import { TypeOrmConfigService } from './lib/database/typeorm-config.service';
import alpacaConfig from './modules/alpaca/config/alpaca.config';
import authConfig from './modules/auth/config/auth.config';
import mailConfig from './modules/mail/config/mail.config';
import redisConfig from './modules/redis/config/redis.config';
import googleConfig from './modules/auth-google/config/google.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        authConfig,
        googleConfig,
        mailConfig,
        databaseConfig,
        redisConfig,
        alpacaConfig,
      ],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) =>
        new DataSource(options).initialize(),
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
    EventEmitterModule.forRoot({
      global: true,
    }),
    AuthModule,
    AuthGoogleModule,
    UsersModule,
    MailModule,
    MailerModule,
    MarketDataModule,
  ],
})
export class AppModule {}
