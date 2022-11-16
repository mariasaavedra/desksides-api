import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
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

  async login(user: User) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout() {
    return {
      access_token: this.jwtService.sign(null),
    };
  }

  async resetPassword(email: string) {
    try {
      const user = await this.usersService.findOne(email);
      const payload = { email: user.email, sub: user.id };
      const token = this.jwtService.sign(payload, {
        secret: process.env.JWT_TOKEN,
        expiresIn: '1h',
      });
      return { ...user, token: token };
    } catch (error) {
      return { error: `Invalid email` };
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
