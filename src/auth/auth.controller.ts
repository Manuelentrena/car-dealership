import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUser } from 'src/common/decorators';
import { Auth } from 'src/common/decorators/auth.decorator';
import { AuthService } from './auth.service';
import {
  ActivateAccountResponse,
  LoginAuthDto,
  LoginUserResponse,
  RegisterAuthDto,
  RegisterUserResponse,
} from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: RegisterUserResponse,
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: email already registered',
  })
  register(@Body() registerAuthDto: RegisterAuthDto) {
    return this.authService.register(registerAuthDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    type: LoginUserResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: Invalid credentials',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict: User is not active',
  })
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Post('activate/:token')
  @ApiOperation({ summary: 'Activate user account with token' })
  @ApiResponse({
    status: 200,
    description: 'Account activated successfully',
    type: ActivateAccountResponse,
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: Invalid activation token',
  })
  activate(@Param('token') token: string) {
    return this.authService.activateAccount(token);
  }

  @Auth()
  @ApiBearerAuth()
  @Get('check-status')
  @ApiOperation({ summary: 'Check current authentication status' })
  @ApiResponse({
    status: 200,
    description: 'User authentication status and new access token',
    type: LoginUserResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized: User is not authenticated',
  })
  @Get('check-status')
  checkStatus(@AuthUser('id') userId: string) {
    return this.authService.checkStatus(userId);
  }
}
