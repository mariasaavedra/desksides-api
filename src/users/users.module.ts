import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, JwtService, PrismaService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
