import { ConfigType } from '@config/config.type';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { OrNeverType } from 'src/shared/types/or-never.type';
import { JwtPayloadType } from './types/jwt-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService<ConfigType>) {
    super({
      jwtFromRequest: (req) => {
        let token = null;
        if (req && req.cookies) {
          token = req.cookies.accessToken;
        }
        return token;
      },
      secretOrKey: configService.get<string>('auth.secret', { infer: true }),
    });
  }

  public validate(payload: JwtPayloadType): OrNeverType<JwtPayloadType> {
    if (!payload.id) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
