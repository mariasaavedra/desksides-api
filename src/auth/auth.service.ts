import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as crypto from 'node:crypto';
import {
  SendEmailService,
  SGTemplateEmailConfig,
} from '../send-email/send-email.service';
import { STATUS_CODES } from 'node:http';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private sendEmail: SendEmailService,
  ) {}

  async validateUser(
    email: string,
    pw: string,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.findOne(email);
    const isValidPassword = await bcryptjs.compareSync(pw, user.password); // compares hash.
    if (user && isValidPassword) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user) {
    if (user) {
      try {
        const validUser = await this.validateUser(user.email, user.password);
        if (!validUser) {
          Logger.error(`Could not login`);
          return HttpStatus.FORBIDDEN;
        }
        const payload = { email: validUser.email, sub: validUser.id };
        return {
          access_token: this.jwtService.sign(payload),
        };
      } catch (e) {
        Logger.error(`Could not login: ${e}`);
      }
      return user;
    }

    Logger.error(`Could not login`);
    return;
  }

  async logout() {
    return {
      access_token: this.jwtService.sign(null),
    };
  }

  async generatePasswordToken(): Promise<string> {
    let token: string;
    await crypto.generateKey('hmac', { length: 64 }, (err, key) => {
      token = key.export().toString('hex');
    });
    return token;
  }

  async resetPasswordEmail(data: { email: string }) {
    try {
      const { email } = data;
      const token = await this.generatePasswordToken();
      const user = await this.usersService.findOne(email);
      const config: SGTemplateEmailConfig = {
        templateId: '',
        to: '',
        from: '',
        dynamic_template_data: {
          token,
        },
      };
      try {
        await this.usersService.update(user.id, { token });
        await this.sendEmail.sendPasswordReset(config);
      } catch (e) {
        Logger.debug(e);
        Logger.error('Failed to send password reset email.');
      }
    } catch (error) {
      return { error: `Invalid email` };
    }
  }

  async resetPassword(data: {
    token: string;
    password: string;
    email: string;
  }) {
    const { token, password, email } = data;
    const user = await this.usersService.findOne(email);
    if (user.token === token) {
      try {
        this.usersService.update(user.id, { password });
        const payload = { email: user.email, sub: user.id };
        const jwtToken = this.jwtService.sign(payload, {
          secret: process.env.JWT_TOKEN,
          expiresIn: '1h',
        });
        return { ...user, token: jwtToken };
      } catch (e) {
        Logger.error('Failed to reset password.');
      }
    } else {
      throw new Error('Unable to validate user credentials');
    }
  }

  async register(userDTO: User) {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...userDTO,
        },
      });
      const payload = { email: user.email, sub: user.id };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (e: unknown) {
      Logger.error(`Failed to register user.`);
    }
  }
}
