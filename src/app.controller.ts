import { Controller, Request, Post, UseGuards, Get } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // @UseGuards(LocalAuthGuard)
  // @Post('auth/register')
  // async register(@Request() req) {
  //   return this.authService.register(req.user);
  // }

  @Get('/hello')
  async hello() {
    console.log(process.env.JWT_S);
    return 'hello';
  }
}
