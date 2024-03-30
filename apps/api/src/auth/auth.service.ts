import { MailService } from '@/mail/mail.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { SessionService } from '@/session/session.service';
import { RolesEnum } from '@/shared/enums/roles.enum';
import { StatusesEnum } from '@/shared/enums/statuses.enum';
import { UsersService } from '@/users/users.service';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import {
  EmailLoginDto,
  LoginResponseType,
  RegisterDto,
  Session,
  User,
} from '@qbick/shared';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { AuthProvidersEnum } from './enums/auth-providers.enum';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { ConfigType } from '@/shared/config/config.type';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private sessionService: SessionService,
    private readonly jwtService: JwtService,
    private configService: ConfigService<ConfigType>,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto): Promise<void> {
    const user = await this.userService.create({
      ...dto,
      email: dto.email,
      role: {
        id: RolesEnum.user,
      },
      status: {
        id: StatusesEnum.inactive,
      },
    });

    const hash = await this.jwtService.signAsync(
      {
        confirmEmailUserId: user.id,
      },
      {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
        expiresIn: this.configService.getOrThrow('auth.confirmEmailExpires', {
          infer: true,
        }),
      },
    );
    await this.mailService.confirmEmail({
      to: dto.email,
      data: {
        hash,
      },
    });
  }

  async confirmEmail(hash: string): Promise<void> {
    let userId: User['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: User['id'];
      }>(hash, {
        secret: this.configService.getOrThrow('auth.confirmEmailSecret', {
          infer: true,
        }),
      });

      userId = jwtData.confirmEmailUserId;
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            hash: `invalidHash`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const user = await this.userService.findById(userId);

    if (!user || user?.status?.id !== StatusesEnum.inactive) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `notFound`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    user.status = {
      id: StatusesEnum.active,
    };

    await this.userService.update(user.id, user);
  }

  async login(loginDto: EmailLoginDto): Promise<LoginResponseType> {
    const user = await this.userService.findOne({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'notFound',
        },
      });
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: `needLoginViaProvider:${user.provider}`,
        },
      });
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'incorrectPassword',
        },
      });
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const session = await this.sessionService.createSession({
      user,
      hash,
    });

    const { accessToken, refreshToken } = await this.getTokensData({
      id: session.user.id,
      role: session.user.role,
      sessionId: session.id,
      hash,
    });

    return {
      refreshToken,
      accessToken,
      user,
    };
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'sessionId' | 'hash'>,
  ): Promise<Omit<LoginResponseType, 'user'>> {
    const session = await this.sessionService.findOne({
      where: {
        id: Number(data.sessionId),
      },
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    if (session.hash !== data.hash) {
      throw new UnauthorizedException();
    }

    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    await this.sessionService.update(session.id, {
      hash,
    });

    const { accessToken, refreshToken } = await this.getTokensData({
      id: session.user.id,
      role: session.user.role,
      sessionId: session.id,
      hash,
    });

    return {
      refreshToken,
      accessToken,
    };
  }

  async logout(data: Pick<JwtRefreshPayloadType, 'sessionId'>) {
    return this.sessionService.softDelete({
      id: data.sessionId,
    });
  }

  private async getTokensData(data: {
    id: User['id'];
    role: User['role'];
    sessionId: Session['id'];
    hash: Session['hash'];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow('auth.accessExpires', {
      infer: true,
    });

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.accessSecret', {
            infer: true,
          }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: this.configService.getOrThrow('auth.refreshExpires', {
            infer: true,
          }),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
