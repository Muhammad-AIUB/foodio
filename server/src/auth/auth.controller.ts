import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { SignInDto } from './dto/signin.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@CurrentUser() user: User) {
    const { password, ...safe } = user as any;
    return safe;
  }
}
