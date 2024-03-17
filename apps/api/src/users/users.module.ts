import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersRepository } from './repository/users.repository';
import { UserEntity } from '@/shared/entities/user.entity';
import { SessionEntity } from '@/shared/entities/session.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, SessionEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UsersRepositoryInterface',
      useClass: UsersRepository,
    },
  ],
  exports: [
    {
      provide: 'UsersRepositoryInterface',
      useClass: UsersRepository,
    },
  ],
})
export class UserModule {}
