import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hashPassword, verifyPassword } from './utils/password.util';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/signin.dto';
import { AuthResponse } from './auth.types';
import { CreateUserInput } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const hashed = await hashPassword(dto.password, SALT_ROUNDS);
    const input: CreateUserInput = {
      fullName: dto.fullName,
      email: dto.email,
      password: hashed,
      ...(dto.address != null && { address: dto.address }),
    };
    const user = await this.usersService.create(input);
    return this.buildAuthResponse(user);
  }

  async signIn(dto: SignInDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await verifyPassword(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    return this.buildAuthResponse(user);
  }

  sanitize<T extends { password?: string }>(user: T): Omit<T, 'password'> {
    const { password, ...rest } = user;
    void password;
    return rest;
  }

  private buildAuthResponse(user: User): AuthResponse {
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return { accessToken: token, user: this.sanitize(user) };
  }
}
