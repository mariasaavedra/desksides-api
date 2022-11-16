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

  async findAll(): Promise<Array<User>> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async update(id: number, updateUserDTO: UpdateUserDto): Promise<User> {
    const users = await this.prisma.user.update({
      where: { id },
      data: { ...updateUserDTO },
    });
    return users;
  }

  async remove(id: number): Promise<User> {
    const user = await this.prisma.user.delete({ where: { id } });
    return user;
  }
}
