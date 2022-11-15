import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

export interface Subscription {
  id: string;
  label: string;
  monthly_cost: number;
  yearly_cost: number;
}

export interface PaymentRequestBody {
  subscriptions: Subscription[];
  currency: string;
}

@Injectable()
export class PaymentsService {
  private stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: '2022-08-01',
    });
  }

  createPayment(paymentRequestBody: PaymentRequestBody): Promise<any> {
    let sumAmount = 0;
    paymentRequestBody.subscriptions.forEach((sub) => {
      sumAmount = sumAmount + sub.yearly_cost;
    });
    return this.stripe.paymentIntents.create({
      amount: sumAmount * 100,
      currency: paymentRequestBody.currency,
    });
  }
}
