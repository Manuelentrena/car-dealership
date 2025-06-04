import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { User } from 'database/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginAuthDto, RegisterAuthDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserResponse } from './interfaces/login-user-response.interface.ts';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  public async register(registerAuthDto: RegisterAuthDto) {
    try {
      const existingUser = await this.userRepository.findOneBy({
        email: registerAuthDto.email,
      });

      if (existingUser) {
        throw new ConflictException('El correo ya está registrado');
      }

      const hashedPassword = await this.hashPassword(registerAuthDto.password);
      const activationToken = randomBytes(32).toString('hex');

      const user = this.userRepository.create({
        email: registerAuthDto.email,
        fullName: registerAuthDto.fullName,
        password: hashedPassword,
        activationToken: activationToken,
        isActive: false,
        roles: ['user'],
      });

      const savedUser = await this.userRepository.save(user);

      const { password: _, activationToken: __, ...result } = savedUser;

      return result;
    } catch (error) {
      console.error('Error during registration:', error);
      throw new ConflictException(error.message || 'Error during registration');
    }
  }

  public async login(loginAuthDto: LoginAuthDto) {
    try {
      const user = await this.userRepository.findOneBy({
        email: loginAuthDto.email,
      });

      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      const isPasswordValid = await this.comparePasswords(
        loginAuthDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Credenciales incorrectas');
      }

      if (!user.isActive) {
        throw new ConflictException('El usuario no está activo');
      }

      const payload: JwtPayload = {
        sub: user.id,
        email: user.email,
        roles: user.roles,
      };

      const token = await this.generateToken(payload);

      if (!token) {
        throw new ConflictException('Error generating token');
      }

      return {
        accessToken: token,
        user: this.buildUserResponse(user),
      };
    } catch (error) {
      console.error('Error during login:', error);
      throw new ConflictException(error.message || 'Error during login');
    }
  }

  public async activateAccount(token: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({
      activationToken: token,
    });

    if (!user) {
      throw new NotFoundException('Token inválido');
    }

    user.isActive = true;
    user.activationToken = null;

    await this.userRepository.save(user);

    return { message: 'Cuenta activada correctamente' };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  private async comparePasswords(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  private async generateToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  private buildUserResponse(user: User): LoginUserResponse {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roles: user.roles,
    };
  }
}
