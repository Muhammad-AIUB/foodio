import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { normalizeEmail } from '../../common/dto/transformers';

export class SignInDto {
  @IsEmail()
  @Transform(normalizeEmail)
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
