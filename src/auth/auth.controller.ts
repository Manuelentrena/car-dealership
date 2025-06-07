import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AuthUser } from 'src/common/decorators';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AuthService } from './auth.service';
import { LoginAuthDto, RegisterAuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }
  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }
  @Post('activate/:token')
  activate(@Param('token') token: string) {
    return this.authService.activateAccount(token);
  }
  @Auth()
  @Get('check-status')
  checkStatus(@AuthUser('id') userId: string) {
    return this.authService.checkStatus(userId);
  }
}
