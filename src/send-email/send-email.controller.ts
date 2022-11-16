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
      to: '',
      templateId: 'XXX-000-XXX-000',
    };
    return this.sendEmailService.sendSGTemplateEmail(config);
  }
  @Post('verify-email')
  sendConfirmation(@Body() config: SGTemplateEmailConfig) {
    return this.sendEmailService.sendConfirmation(config);
  }
  @Post('journalist-approved')
  sendJournalistApproved(@Body() config: SGTemplateEmailConfig) {
    return this.sendEmailService.sendJournalistApproved(config);
  }
  @Post('journalist-rejected')
  sendJournalistRejected(@Body() config: SGTemplateEmailConfig) {
    return this.sendEmailService.sendJournalistRejected(config);
  }
  @Post('brand-approved')
  sendBrandApproved(@Body() config: SGTemplateEmailConfig) {
    return this.sendEmailService.sendBrandApproved(config);
  }
  @Post('brand-rejected')
  sendBrandRejected(@Body() config: SGTemplateEmailConfig) {
    return this.sendEmailService.sendBrandRejected(config);
  }
  @Post('reset-password')
  sendPasswordReset(@Body() config: SGTemplateEmailConfig) {
    return this.sendEmailService.sendPasswordReset(config);
  }
}
