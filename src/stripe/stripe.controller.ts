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

const stripe = new Stripe(
  'sk_test_51LwVlYGbjwd92QzUL2KUWuXBNxWkTFXnrQgluVr4CrfPiXasdUBwLuq2kwSVdnQlqfp6r7eYp9IUd5wSrW5SvOXH00ivjNORRN',
  { apiVersion: '2022-08-01' },
);
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
    console.log('WEBHOOK WAS TOUCHED', req);
    const endpointSecret =
      'whsec_a7985fd09f89ec980ac4d18eed64fdca1faba9ed6a596f9e1b619de1ca68986c';
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  }

  @Post('create-payment-intent')
  async createPaymentIntent(@Req() req) {
    const { items } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 100,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });
    return { clientSecret: paymentIntent.client_secret };
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
    const prices = await stripe.prices.list({
      lookup_keys: [req.body.lookup_key],
      expand: ['data.product'],
    });
    try {
      const session = await stripe.checkout.sessions.create({
        billing_address_collection: 'auto',
        line_items: [
          {
            price: prices.data[0].id,

            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${domainURL}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${domainURL}?canceled=true`,
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
