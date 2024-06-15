import { Module } from '@nestjs/common';
import { RelationalSessionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { SessionsService } from './sessions.service';

@Module({
  imports: [RelationalSessionPersistenceModule],
  providers: [SessionsService],
  exports: [SessionsService, RelationalSessionPersistenceModule],
})
export class SessionsModule {}
