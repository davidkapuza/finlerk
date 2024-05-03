import { MailModule } from '@/mail/mail.module';
import { SessionService } from '@/session/session.service';
import { SessionEntity } from '@/shared/entities/session.entity';
import { UserEntity } from '@/shared/entities/user.entity';
import { DoesExist } from '@/shared/validators/does-exist.validator';
import { DoesNotExist } from '@/shared/validators/does-not-exist.validator';
import { UsersService } from '@/users/users.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.stategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '@/users/users.module';
import { SessionModule } from '@/session/session.module';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { ConfigType } from '@/shared/config/config.type';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity, UserEntity]),
    JwtModule.register({}),
    PassportModule,
    MailModule,
    UserModule,
    SessionModule,
  ],
  exports: [AuthService, 'TOKENS_COOKIE_OPTIONS'],
  providers: [
    {
      provide: 'TOKENS_COOKIE_OPTIONS',
      useFactory: (configService: ConfigService<ConfigType>) => {
        const accessExpires = ms(
          configService.getOrThrow<string>('auth.accessExpires', {
            infer: true,
          }),
        );
        const refreshExpires = ms(
          configService.getOrThrow<string>('auth.refreshExpires', {
            infer: true,
          }),
        );

        return {
          accessTokenCookieOptions: {
            expires: new Date(Date.now() + accessExpires),
            maxAge: accessExpires,
            httpOnly: true,
            sameSite: 'lax',
          },
          refreshTokenCookieOptions: {
            xpires: new Date(Date.now() + refreshExpires),
            maxAge: refreshExpires,
            httpOnly: true,
            sameSite: 'lax',
          },
        };
      },
      inject: [ConfigService],
    },
    DoesNotExist,
    DoesExist,
    JwtStrategy,
    JwtRefreshStrategy,
    AuthService,
    UsersService,
    SessionService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
