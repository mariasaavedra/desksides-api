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
  // create(createUserssDto: CreateUserssDto) {
  //   return 'This action adds a new userss';
  // }

  // findAll() {
  //   return `This action returns all userss`;
  // }

  // update(id: number, updateUserssDto: UpdateUserssDto) {
  //   return `This action updates a #${id} userss`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} userss`;
  // }
}
