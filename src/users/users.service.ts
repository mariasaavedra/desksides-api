import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export type UpdateUserDto = Partial<User>;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async findOne(email: string): Promise<User | undefined> {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | undefined> {
    const userId = parseInt(id);
    return await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        Profile: true,
      },
    });
  }

  async findAll(): Promise<Array<User>> {
    const users = await this.prisma.user.findMany({
      include: { Profile: true },
    });
    return users;
  }

  async update(id: number, updateUserDTO: UpdateUserDto): Promise<User> {
    const users = await this.prisma.user.update({
      where: { id },
      include: {
        Profile: true,
      },
      data: { ...updateUserDTO },
    });
    return users;
  }

  async remove(id: number): Promise<User> {
    const user = await this.prisma.user.delete({ where: { id } });
    return user;
  }
}
