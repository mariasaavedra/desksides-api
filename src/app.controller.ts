import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
} from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @Post('auth/login')
  async login(@Body() req) {
    return this.authService.login(req.data);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/register')
  async register(@Request() req) {
    return this.authService.register(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/logout')
  async logout() {
    return this.authService.logout();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/reset-password')
  async resetPassword(@Request() req) {
    return this.authService.resetPassword(req);
  }

  @Get('/hello')
  async hello() {
    console.log(process.env.JWT_SECRET);
    return 'hello';
  }
}
