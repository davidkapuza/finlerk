import { AppConfig } from './app-config.type';
import { DatabaseConfig } from '@database/config/database-config.type';
import { AuthConfig } from '@auth/config/auth-config.type';
import { MailConfig } from '@mail/config/mail-config.type';

export type ConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  mail: MailConfig;
};
