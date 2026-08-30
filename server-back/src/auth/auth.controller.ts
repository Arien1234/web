import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LoginDto, RegisterDto } from '../common/dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const data = await this.authService.login(body.username, body.password);
    return { code: 0, message: '登录成功', data };
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const data = await this.authService.register(body);
    return { code: 0, message: '注册成功', data };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async profile(@Req() req: { user: { id: number } }) {
    const data = await this.authService.profile(req.user.id);
    return { code: 0, data };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout() {
    return { code: 0, message: '已退出' };
  }
}
