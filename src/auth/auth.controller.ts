import { Body, Controller, Param, Post } from '@nestjs/common';
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
}
