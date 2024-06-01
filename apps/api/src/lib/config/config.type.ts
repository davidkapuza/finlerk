import { AppConfig } from './app-config.type';
import { DatabaseConfig } from '../database/config/database-config.type';
import { RedisConfig } from '@/modules/redis-pub-sub/config/redis-config.type';
import { AlpacaConfig } from '@/modules/alpaca/config/alpaca-config.type';

export type ConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  redis: RedisConfig;
  alpaca: AlpacaConfig;
};
