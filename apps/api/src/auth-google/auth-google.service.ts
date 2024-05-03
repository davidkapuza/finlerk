import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { ConfigType } from '@/shared/config/config.type';
import { SocialInterface } from '@/shared/interfaces/social.interface';
import { AuthGoogleLoginDto } from '@finlerk/shared';

@Injectable()
export class AuthGoogleService {
  private google: OAuth2Client;

  constructor(private configService: ConfigService<ConfigType>) {
    this.google = new OAuth2Client(
      configService.get('google.clientId', { infer: true }),
      configService.get('google.clientSecret', { infer: true }),
      configService.get('google.redirectUri', { infer: true }),
    );
  }

  async getAuthUrl() {
    return this.google.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/userinfo.profile',
    });
  }

  async getProfile(loginDto: AuthGoogleLoginDto): Promise<SocialInterface> {
    const { tokens } = await this.google.getToken(loginDto.code);

    const ticket = await this.google.verifyIdToken({
      idToken: tokens.id_token,
      audience: [
        this.configService.getOrThrow('google.clientId', { infer: true }),
      ],
    });

    const data = ticket.getPayload();

    if (!data) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'wrongToken',
        },
      });
    }

    return {
      id: data.sub,
      email: data.email,
      firstName: data.given_name,
      lastName: data.family_name,
    };
  }
}
