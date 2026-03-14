import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { hashPassword, verifyPassword } from './utils/password.util';
import { UsersService, SafeUser } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/signin.dto';
import { AuthResponse, RegisterResponse } from './auth.types';
import { CreateUserInput } from '../users/dto/create-user.dto';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<RegisterResponse> {
    const hashed = await hashPassword(dto.password, SALT_ROUNDS);
    const input: CreateUserInput = {
      name: dto.name,
      email: dto.email,
      password: hashed,
    };
    const user = await this.usersService.create(input);
    this.logger.log(`User registered: ${user.email}`);
    return {
      success: true,
      message: 'Registration successful',
    };
  }

  async signIn(dto: SignInDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await verifyPassword(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.log(`User signed in: ${user.email}`);
    return this.buildAuthResponse(user);
  }

  /** Strip password from a User record before sending it to the client. */
  sanitize(user: User): SafeUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private buildAuthResponse(user: User): AuthResponse {
    const token = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role });
    return { accessToken: token, user: this.sanitize(user) };
  }
}
