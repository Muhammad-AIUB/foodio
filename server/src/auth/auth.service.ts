import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/signin.dto';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const hashed = await bcrypt.hash(dto.password, SALT_ROUNDS);
    const user = await this.usersService.create({
      ...dto,
      password: hashed,
    });

    const token = this.issueToken(user.id, user.email);
    return { accessToken: token, user: this.sanitize(user) };
  }

  async signIn(dto: SignInDto) {
    // O(1) — indexed email lookup
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const token = this.issueToken(user.id, user.email);
    return { accessToken: token, user: this.sanitize(user) };
  }

  private issueToken(sub: string, email: string): string {
    return this.jwtService.sign({ sub, email });
  }

  private sanitize(user: any) {
    const { password, ...safe } = user;
    return safe;
  }
}
