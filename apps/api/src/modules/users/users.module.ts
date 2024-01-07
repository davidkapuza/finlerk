import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersRepository } from '@modules/users/repository/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@entities/user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    {
      provide: 'UsersRepositoryInterface',
      useClass: UsersRepository,
    },
    UsersService,
  ],
})
export class UserModule {}
