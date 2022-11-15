import { Body, Controller, Get, Post } from '@nestjs/common';
import { SendEmailService, SGTemplateEmailConfig } from './send-email.service';

@Controller('send-email')
export class SendEmailController {
  constructor(private readonly sendEmailService: SendEmailService) {}
  @Get()
  sendTestEmail() {
    return this.sendEmailService.sendTestEmail();
  }
  @Post()
  sendSGTemplateEmail() {
    const config: SGTemplateEmailConfig = {
      from: 'info@desksides.com',
      to: 'msaav3@gmail.com',
      templateId: 'd-feac410afddc48ab8b54b6257f131383',
    };
    return this.sendEmailService.sendSGTemplateEmail(config);
  }
  @Post('confirmation')
  sendFacilityNewMessage(@Body() config: SGTemplateEmailConfig) {
    const templateId = 'd-9b5a41314f2b405f95c49d5f7761a60';
    return this.sendEmailService.sendSGTemplateEmail({ ...config, templateId });
  }
}
