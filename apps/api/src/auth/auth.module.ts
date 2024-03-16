import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.stategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Session, UserEntity } from '@qbick/shared/entities';
import { MailModule } from '@/mail/mail.module';
import { DoesNotExist } from '@/shared/validators/does-not-exist.validator';
import { DoesExist } from '@/shared/validators/does-exist.validator';
import { UsersRepository } from '@/users/repository/users.repository';
import { SessionRepository } from '@/shared/repositories/session/session.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Session, UserEntity]),
    JwtModule.register({}),
    PassportModule,
    MailModule,
  ],
  providers: [
    DoesNotExist,
    DoesExist,
    JwtStrategy,
    JwtRefreshStrategy,
    { provide: 'AuthServiceInterface', useClass: AuthService },
    {
      provide: 'UsersRepositoryInterface',
      useClass: UsersRepository,
    },
    {
      provide: 'SessionRepositoryInterface',
      useClass: SessionRepository,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
