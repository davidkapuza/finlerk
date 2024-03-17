import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionEntity } from '@/shared/entities/session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionRepository } from '@/shared/repositories/session/session.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [
    SessionService,
    {
      provide: 'SessionRepositoryInterface',
      useClass: SessionRepository,
    },
  ],
  exports: [
    {
      provide: 'SessionRepositoryInterface',
      useClass: SessionRepository,
    },
  ],
})
export class SessionModule {}
