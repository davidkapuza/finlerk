import { registerAs } from '@nestjs/config';
import { AlpacaConfig } from './alpaca-config.type';
import { IsString } from 'class-validator';
import validateConfig from '@utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  ALPACA_API_KEY: string;

  @IsString()
  ALPACA_API_SECRET: string;
}

export default registerAs<AlpacaConfig>('alpaca', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    token: process.env.ALPACA_API_KEY,
    secret: process.env.ALPACA_API_SECRET,
  };
});
