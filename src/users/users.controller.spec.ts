import { Test, TestingModule } from '@nestjs/testing';
import { UserssController } from './users.controller';
import { UsersService } from './users.service';

describe('UserssController', () => {
  let controller: UserssController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserssController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UserssController>(UserssController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
