import { AppConfig } from './app-config.type';
import { DatabaseConfig } from '@database/config/database-config.type';
import { AuthConfig } from '@auth/config/auth-config.type';
import { MailConfig } from '@mail/config/mail-config.type';
import { RedisConfig } from '@modules/redis-pub-sub/config/redis-config.type';
import { AlpacaConfig } from '@modules/alpaca/config/alpaca-config.type';

export type ConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  mail: MailConfig;
  redis: RedisConfig;
  alpaca: AlpacaConfig;
};
