import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import redisStore from 'cache-manager-redis-store';
import { DataSource, DataSourceOptions } from 'typeorm';
import alpacaConfig from './alpaca/config/alpaca.config';
import { AuthModule } from './auth/auth.module';
import authConfig from './auth/config/auth.config';
import mailConfig from './mail/config/mail.config';
import { MailModule } from './mail/mail.module';
import { MailerModule } from './mailer/mailer.module';
import { MarketDataModule } from './market-data/market-data.module';
import redisConfig from './redis-pub-sub/config/redis.config';
import { RedisPubSubModule } from './redis-pub-sub/redis-pub-sub.module';
import appConfig from './shared/config/app.config';
import { ConfigType } from './shared/config/config.type';
import databaseConfig from './shared/database/config/database.config';
import { TypeOrmConfigService } from './shared/database/typeorm-config.service';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    ScheduleModule.forRoot(),
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
    MarketDataModule,
  ],
})
export class AppModule {}
