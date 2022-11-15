import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

export interface EmailConfig {
  to: string | string[];
  from: string;
  replyTo?: string;
  subject?: string;
}
export interface SGTemplateEmailConfig extends EmailConfig {
  templateId: string;
  dynamic_template_data?: Record<string, string>;
}

@Injectable()
export class SendEmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }
  async sendSGTemplateEmail(config: SGTemplateEmailConfig) {
    try {
      await sgMail.send({ ...config });
    } catch (e) {
      console.error(e);
    }
  }
  async sendTestEmail() {
    const msg = {
      to: 'maria@advadigitalsolutions.com',
      from: 'molly@superbshifts.com',
      subject: 'Testing SendGrid Integration',
      text: 'Hello plain world!',
      html: '<p>Hello HTML world!</p>',
    };
    await sgMail.send(msg);
  }
}
