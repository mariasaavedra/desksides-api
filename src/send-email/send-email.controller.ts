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
    const templateId = 'XXX-000-XXX-000';
    return this.sendEmailService.sendSGTemplateEmail({ ...config, templateId });
  }
  @Post('journalist-approved')
  sendJournalistApproved(@Body() config: SGTemplateEmailConfig) {
    const templateId = 'XXX-000-XXX-000';
    return this.sendEmailService.sendSGTemplateEmail({ ...config, templateId });
  }
  @Post('journalist-rejected')
  sendJournalistRejected(@Body() config: SGTemplateEmailConfig) {
    const templateId = 'XXX-000-XXX-000';
    return this.sendEmailService.sendSGTemplateEmail({ ...config, templateId });
  }
  @Post('brand-approved')
  sendBrandApproved(@Body() config: SGTemplateEmailConfig) {
    const templateId = 'XXX-000-XXX-000';
    return this.sendEmailService.sendSGTemplateEmail({ ...config, templateId });
  }
  @Post('brand-rejected')
  sendBrandRejected(@Body() config: SGTemplateEmailConfig) {
    const templateId = 'XXX-000-XXX-000';
    return this.sendEmailService.sendSGTemplateEmail({ ...config, templateId });
  }
  @Post('reset-password')
  sendPasswordReset(@Body() config: SGTemplateEmailConfig) {
    const templateId = 'XXX-000-XXX-000';
    return this.sendEmailService.sendSGTemplateEmail({ ...config, templateId });
  }
}
