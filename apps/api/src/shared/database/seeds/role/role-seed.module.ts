import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleSeedService } from './role-seed.service';
import { Role } from '@entities/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  providers: [RoleSeedService],
  exports: [RoleSeedService],
})
export class RoleSeedModule {}
