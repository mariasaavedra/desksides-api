import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import Stripe from 'stripe';
import { PrismaService } from '../prisma/prisma.service';
import {
  SendEmailService,
  SGTemplateEmailConfig,
} from '../send-email/send-email.service';
import { StripeService } from './stripe.service';

const stripe = new Stripe('', { apiVersion: '2022-08-01' });
@Controller('stripe')
export class StripeController {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private sendEmail: SendEmailService,
    private stripeService: StripeService,
  ) {}

  @Post('/webhook')
  async webhook(@Req() req: Request) {
    const signature = req.headers['stripe-signature'];

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      const { data, eventType } = req.body.data;
      if (eventType === 'checkout.session.completed') {
        Logger.log('Payment received');
      }

      Logger.log(data, eventType);
      return HttpStatus.NO_CONTENT;
    } else {
      // Retrieve the event by verifying the signature using the raw body and secret.

      const event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
      // Extract the object from the event.
      const { data, type } = event;
      Logger.log(data, type);
      return HttpStatus.NO_CONTENT;
    }
  }
  @Post('checkout-session')
  async checkoutSession(@Req() req) {
    const { sessionId } = req.query;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  }
  @Post('create-checkout-session')
  async createCheckoutSession(@Req() req) {
    const domainURL = process.env.DOMAIN;
    // {CHECKOUT_SESSION_ID}  will have the session ID set as a query param
    const success_url = `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${domainURL}/canceled.html`;
    const { priceId } = req.body;
    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        success_url,
        cancel_url,
      });
      return session.url;
    } catch (e) {
      Logger.error(e);
    }
  }
  @Get('config')
  async config(@Req() req) {
    console.log(req);
  }
  @Post('customer-portal')
  async customerPortal(@Req() req) {
    console.log(req);
  }
}
