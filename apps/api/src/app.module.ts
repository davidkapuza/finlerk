import { AuthModule } from '@auth/auth.module';
import authConfig from '@auth/config/auth.config';
import appConfig from '@config/app.config';
import databaseConfig from '@database/config/database.config';
import { TypeOrmConfigService } from '@database/typeorm-config.service';
import mailConfig from '@mail/config/mail.config';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { MailModule } from './modules/mail/mail.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { UserModule } from './modules/users/users.module';
import { StocksModule } from './modules/stocks/stocks.module';
import redisConfig from '@modules/redis-pub-sub/config/redis.config';
import { RedisPubSubModule } from '@modules/redis-pub-sub/redis-pub-sub.module';
import { ConfigType } from '@shared/config/config.type';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AlpacaModule } from './modules/alpaca/alpaca.module';
import alpacaConfig from '@modules/alpaca/config/alpaca.config';
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
    StocksModule,
    AlpacaModule,
  ],
})
export class AppModule {}
