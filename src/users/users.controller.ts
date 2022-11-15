import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('userss')
export class UserssController {
  constructor(private readonly userService: UsersService) {}

  // @Post()
  // create(@Body() createUserssDto: CreateUserssDto) {
  //   return this.userService.create(createUserssDto);
  // }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserssDto: UpdateUserssDto) {
  //   return this.userService.update(+id, updateUserssDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }
}
