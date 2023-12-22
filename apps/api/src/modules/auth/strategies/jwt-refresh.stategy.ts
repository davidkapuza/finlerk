import { ConfigType } from '@config/config.type';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtRefreshPayloadType } from './types/jwt-refresh-payload.type';
import { OrNeverType } from 'src/shared/types/or-never.type';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService<ConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('auth.refreshSecret', {
        infer: true,
      }),
    });
  }

  public validate(
    payload: JwtRefreshPayloadType,
  ): OrNeverType<JwtRefreshPayloadType> {
    if (!payload.sessionId) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
