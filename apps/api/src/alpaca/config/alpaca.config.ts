import { registerAs } from '@nestjs/config';
import { AlpacaConfig } from './alpaca-config.type';
import { IsString, IsUrl } from 'class-validator';
import validateConfig from '@/shared/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsUrl()
  ALPACA_MARKET_DATA_API: string;

  @IsUrl()
  ALPACA_TRADING_API: string;

  @IsString()
  ALPACA_API_KEY: string;

  @IsString()
  ALPACA_API_SECRET: string;

  @IsUrl()
  ALPACA_BROKER_API: string;

  @IsString()
  ALPACA_BROKER_API_USERNAME: string;

  @IsString()
  ALPACA_BROKER_API_PASSWORD: string;

  @IsString()
  ALPACA_BROKER_API_AUTH_HEADER: string;
}

export default registerAs<AlpacaConfig>('alpaca', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    market_data_api: process.env.ALPACA_MARKET_DATA_API,
    trading_api: process.env.ALPACA_TRADING_API,
    token: process.env.ALPACA_API_KEY,
    secret: process.env.ALPACA_API_SECRET,
    broker_api: process.env.ALPACA_BROKER_API,
    broker_api_username: process.env.ALPACA_BROKER_API_USERNAME,
    broker_api_password: process.env.ALPACA_BROKER_API_PASSWORD,
    broker_api_auth_header: process.env.ALPACA_BROKER_API_AUTH_HEADER,
  };
});
