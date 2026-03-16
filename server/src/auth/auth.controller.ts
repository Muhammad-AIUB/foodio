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
import type { CookieOptions, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/signin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { SafeUser } from '../users/users.service';
import type { RegisterResponse } from './auth.types';

const COOKIE_NAME = 'access_token';
const MAX_AGE_MS = 1000 * 60 * 60 * 24; // 24 h

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto): Promise<RegisterResponse> {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ user: SafeUser; accessToken: string }> {
    const { accessToken, user } = await this.authService.signIn(dto);
    this.setTokenCookie(res, accessToken);
    return { user, accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('signout')
  signOut(@Res({ passthrough: true }) res: Response): { message: string } {
    res.clearCookie(COOKIE_NAME, this.getCookieOptions());
    return { message: 'Signed out' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user: User): SafeUser {
    return this.authService.sanitize(user);
  }

  private setTokenCookie(res: Response, token: string): void {
    res.cookie(COOKIE_NAME, token, {
      ...this.getCookieOptions(),
      maxAge: MAX_AGE_MS,
    });
  }

  private getCookieOptions(): CookieOptions {
    const nodeEnv = this.config.get<string>('NODE_ENV');
    const frontendUrl = this.config.get<string>('FRONTEND_URL') ?? '';
    const requireSecure =
      nodeEnv === 'production' || frontendUrl.startsWith('https');

    return {
      httpOnly: true,
      secure: requireSecure,
      sameSite: requireSecure ? 'none' : 'lax',
      path: '/',
    };
  }
}
