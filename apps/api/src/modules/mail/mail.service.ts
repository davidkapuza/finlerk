import { ConfigType } from '@config/config.type';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '../mailer/mailer.service';
import { MailData } from './interfaces/mail-data.interface';
import * as path from 'node:path';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService<ConfigType>,
  ) {}

  async confirmEmail(mailData: MailData<{ hash: string }>): Promise<void> {
    const url = new URL(
      this.configService.getOrThrow('app.frontendDomain', {
        infer: true,
      }) + '/confirm-email',
    );
    url.searchParams.set('hash', mailData.data.hash);

    await this.mailerService.sendMail({
      to: mailData.to,
      subject: 'Confirm email',
      text: `${url.toString()} Confirm email`,
      templatePath: path.join(
        this.configService.getOrThrow('app.workingDirectory', {
          infer: true,
        }),
        'src',
        'modules',
        'mail',
        'templates',
        'activation.hbs',
      ),
      context: {
        title: 'Confirm email',
        url: url.toString(),
        actionTitle: 'Confirm email',
        app_name: this.configService.get('app.name', { infer: true }),
        text1: 'Hello!',
        text2: 'You almost there',
        text3:
          'Simply click the big green button below to verify your email address.',
      },
    });
  }
}
