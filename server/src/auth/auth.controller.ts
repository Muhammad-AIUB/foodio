import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/signin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { AuthResponse } from './auth.types';

const COOKIE_NAME = 'access_token';
const MAX_AGE_MS = 1000 * 60 * 60 * 24; // 24h

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  private setTokenCookie(res: Response, token: string): void {
    const isProd = this.config.get('NODE_ENV') === 'production';
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: MAX_AGE_MS,
      path: '/',
    });
  }

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<AuthResponse, 'accessToken'>> {
    const { accessToken, ...rest } = await this.authService.register(dto);
    this.setTokenCookie(res, accessToken);
    return rest;
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<AuthResponse, 'accessToken'>> {
    const { accessToken, ...rest } = await this.authService.signIn(dto);
    this.setTokenCookie(res, accessToken);
    return rest;
  }

  @HttpCode(HttpStatus.OK)
  @Post('signout')
  signOut(@Res({ passthrough: true }) res: Response): { message: string } {
    res.clearCookie(COOKIE_NAME, {
      path: '/',
      httpOnly: true,
      secure: this.config.get('NODE_ENV') === 'production',
      sameSite: 'lax',
    });
    return { message: 'Signed out' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user: User): Omit<User, 'password'> {
    return this.authService.sanitize(user);
  }
}
