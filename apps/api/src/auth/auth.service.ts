import { MailService } from '@/mail/mail.service';
import { SessionRepositoryInterface } from '@/shared/repositories/session/sessiony-repository.interface';
import { UsersRepositoryInterface } from '@/users/repository/users-repository.interface';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  RoleEntity,
  Session,
  StatusEntity,
  UserEntity,
} from '@qbick/shared/entities';
import {
  AuthProvidersEnum,
  RolesEnum,
  StatusesEnum,
} from '@qbick/shared/enums';
import { LoginResponseType } from '@qbick/shared/types';
import * as bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import ms from 'ms';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { AuthServiceInterface } from './interface/auth-service.interface';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';

@Injectable()
export class AuthService implements AuthServiceInterface {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly userRepository: UsersRepositoryInterface,
    @Inject('SessionRepositoryInterface')
    private readonly sessionRepository: SessionRepositoryInterface,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  async register(dto: RegisterDto): Promise<void> {
    const user = await this.userRepository.save(
      this.userRepository.create({
        ...dto,
        email: dto.email,
        role: {
          id: RolesEnum.user,
        } as RoleEntity,
        status: {
          id: StatusesEnum.inactive,
        } as StatusEntity,
      }),
    );

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
    let userId: UserEntity['id'];

    try {
      const jwtData = await this.jwtService.verifyAsync<{
        confirmEmailUserId: UserEntity['id'];
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
    const user = await this.userRepository.findOneById(userId);

    if (!user || user?.status?.id !== StatusesEnum.inactive) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `notFound`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    user.status = plainToClass(StatusEntity, {
      id: StatusesEnum.active,
    });

    await user.save();
  }

  async login(loginDto: LoginDto): Promise<LoginResponseType> {
    const user = await this.userRepository.findByCondition({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'notFound',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: `needLoginViaProvider:${user.provider}`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const session = await this.sessionRepository.save(
      this.sessionRepository.create({ user }),
    );

    const { accessToken, refreshToken, tokenExpires } = await this.getTokens({
      id: user.id,
      role: user.role,
      sessionId: session.id,
    });

    return {
      refreshToken,
      accessToken,
      tokenExpires,
      user,
    };
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'sessionId'>,
  ): Promise<Omit<LoginResponseType, 'user'>> {
    const session = await this.sessionRepository.findByCondition({
      where: {
        id: data.sessionId,
      },
    });

    if (!session) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken, tokenExpires } = await this.getTokens({
      id: session.user.id,
      role: session.user.role,
      sessionId: session.id,
    });

    return {
      refreshToken,
      accessToken,
      tokenExpires,
    };
  }

  async logout(data: Pick<JwtRefreshPayloadType, 'sessionId'>) {
    return this.sessionRepository.softDelete(data.sessionId);
  }

  private async getTokens(data: {
    id: UserEntity['id'];
    role: UserEntity['role'];
    sessionId: Session['id'];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow<string>(
      'auth.expires',
      {
        infer: true,
      },
    );

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow('auth.secret', { infer: true }),
          expiresIn: tokenExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
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
      tokenExpires,
    };
  }
}
