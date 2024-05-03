import { CookieOptions } from 'express';

export interface TokensCookieOptionsInterface {
  accessTokenCookieOptions: CookieOptions;
  refreshTokenCookieOptions: CookieOptions;
}
