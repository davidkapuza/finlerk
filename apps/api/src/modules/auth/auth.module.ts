import { Session } from '@entities/session.entity';
import { UserEntity } from '@entities/user.entity';
import { MailModule } from '@mail/mail.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionRepository } from '@repositories/session/session.repository';
import { UsersRepository } from '@modules/users/repository/users.repository';
import { DoesExist } from '@validators/does-exist.validator';
import { DoesNotExist } from '@validators/does-not-exist.validator';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.stategy';
import { JwtStrategy } from './strategies/jwt.strategy';

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
