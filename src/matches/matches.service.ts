import { Injectable } from '@nestjs/common';
import { Match } from '@prisma/client';

/*
 * Prisma Client is an auto-generated and type-safe query builder
 * that's generated from our prisma.schema
 */
export type CreateMatchDto = Omit<Match, 'id'>;
export type UpdateMatchDto = Partial<Match>;

@Injectable()
export class MatchesService {
  create(createMatchDto: CreateMatchDto) {
    return 'This action adds a new match';
  }

  findAll() {
    return `This action returns all matches`;
  }

  findOne(id: number) {
    return `This action returns a #${id} match`;
  }

  update(id: number, updateMatchDto: UpdateMatchDto) {
    return `This action updates a #${id} match`;
  }

  remove(id: number) {
    return `This action removes a #${id} match`;
  }
}
