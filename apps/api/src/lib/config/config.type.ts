import { AlpacaConfig } from '@/modules/alpaca/config/alpaca-config.type';
import { AuthConfig } from '@/modules/auth/config/auth-config.type';
import { MailConfig } from '@/modules/mail/config/mail-config.type';
import { RedisConfig } from '@/modules/redis/config/redis-config.type';
import { DatabaseConfig } from '../database/config/database-config.type';
import { AppConfig } from './app-config.type';
import { GoogleConfig } from '@/modules/auth-google/config/google-config.type';

export type ConfigType = {
  app: AppConfig;
  auth: AuthConfig;
  google: GoogleConfig;
  mail: MailConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  alpaca: AlpacaConfig;
};
