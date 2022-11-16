import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SendEmailService } from '../send-email/send-email.service';

@Injectable()
export class StripeService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private sendEmail: SendEmailService,
  ) {}

  // create payment intent
}
