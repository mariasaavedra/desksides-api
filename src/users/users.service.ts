import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  async findOne(email: string): Promise<User | undefined> {
    const prisma = new PrismaClient();
    return await prisma.user.findUnique({ where: { email } });
  }
}
