import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@/mailer/mailer.module';

@Module({
  imports: [MailerModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
