import { AuthModule } from '@auth/auth.module';
import authConfig from '@auth/config/auth.config';
import appConfig from '@config/app.config';
import databaseConfig from '@database/config/database.config';
import { TypeOrmConfigService } from '@database/typeorm-config.service';
import mailConfig from '@mail/config/mail.config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { MailModule } from './modules/mail/mail.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { UserModule } from './modules/users/users.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig, mailConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) =>
        new DataSource(options).initialize(),
    }),
    AuthModule,
    MailModule,
    MailerModule,
    UserModule,
  ],
})
export class AppModule {}
