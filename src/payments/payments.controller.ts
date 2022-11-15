import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { PaymentsService, PaymentRequestBody } from './payments.service';
import { Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentService: PaymentsService) {}

  @Post()
  async createPayments(
    @Res() response: Response,
    @Body() paymentRequestBody: PaymentRequestBody,
  ) {
    try {
      const res = await this.paymentService.createPayment(paymentRequestBody);
      return response.status(HttpStatus.CREATED).json(res);
    } catch (err) {
      response.status(HttpStatus.BAD_REQUEST).json(err);
    }
  }
}
