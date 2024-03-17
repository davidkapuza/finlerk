import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import appConfig from './shared/config/app.config';
import authConfig from './auth/config/auth.config';
import databaseConfig from './shared/database/config/database.config';
import mailConfig from './mail/config/mail.config';
import redisConfig from './redis-pub-sub/config/redis.config';
import alpacaConfig from './alpaca/config/alpaca.config';
import { TypeOrmConfigService } from './shared/database/typeorm-config.service';
import { ConfigType } from './shared/config/config.type';
import { RedisPubSubModule } from './redis-pub-sub/redis-pub-sub.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { MailerModule } from './mailer/mailer.module';
import { UserModule } from './users/users.module';
import { MarketDataModule } from './market-data/market-data.module';
import { AlpacaModule } from './alpaca/alpaca.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        authConfig,
        databaseConfig,
        mailConfig,
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
    EventEmitterModule.forRoot({
      global: true,
    }),
    AuthModule,
    MailModule,
    MailerModule,
    UserModule,
    MarketDataModule,
    AlpacaModule,
  ],
})
export class AppModule {}
