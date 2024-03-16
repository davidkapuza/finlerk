import { AuthConfig } from '@/auth/config/auth-config.type';
import { AppConfig } from './app-config.type';
import { DatabaseConfig } from '../database/config/database-config.type';
import { MailConfig } from '@/mail/config/mail-config.type';
import { RedisConfig } from '@/redis-pub-sub/config/redis-config.type';
import { AlpacaConfig } from '@/alpaca/config/alpaca-config.type';

export type ConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  database: DatabaseConfig;
  mail: MailConfig;
  redis: RedisConfig;
  alpaca: AlpacaConfig;
};
